package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionStatusRequest;
import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TherapistAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TimeSlotAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.BookingSessionDTO;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import com.SWP.SkinCareService.enums.ServiceType;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class  BookingSessionService {
    BookingSessionRepository bookingSessionRepository;
    BookingSessionMapper bookingSessionMapper;
    BookingRepository bookingRepository;
    RoomRepository roomRepository;
    TherapistRepository therapistRepository;
    ServicesRepository servicesRepository;
    SupabaseService supabaseService;
    RoomService roomService;
    FeedbackService feedbackService;
    private final UserRepository userRepository;
    NotificationService notificationService;

    @Transactional
    public BookingSessionResponse createBookingSession(BookingSessionRequest request) {
        Booking booking = getBookingById(request.getBookingId());
        LocalDateTime allowTime = LocalDateTime.now().plusMinutes(30);
        //Check condition to create new booking session
        // 1. Last session have to completed
        // 2. Many session can't in the same day
        // 3. Total session (completed and waiting) can't more than the total session allow of service
        // 4. Time request if after now at least 30 minutes
        if (booking.getSessionRemain() ==0){
            throw new AppException(ErrorCode.BOOKING_IS_COMPLETED);
        }
        if (!isAllowToCreate(request.getBookingId(), request.getSessionDateTime().toLocalDate()) || !allowTime.isBefore(request.getSessionDateTime())) {
            throw new AppException(ErrorCode.BOOKING_REJECTED);
        }
        //Allowed to create new booking session
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        List<BookingSession> sessionToday = bookingSessionRepository.findAllByBookingAndCreateAtBetweenAndStatus(booking, startOfDay, endOfDay, BookingSessionStatus.IS_CANCELED);
        if (sessionToday.size() > 5) {
            throw new AppException(ErrorCode.SPAM_REJECTED);
        }

        BookingSession session = bookingSessionMapper.toBookingSession(request);
        Services service = booking.getService();

        if (request.getTherapistId() != null){
            log.info(request.getTherapistId());
            Therapist therapist = getTherapistById(request.getTherapistId());
            boolean isValid = isTherapistAvailable(therapist.getId(), request.getSessionDateTime(), booking.getService().getDuration());
            if(!isValid)
                throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
            else {
                Set<Services> serviceSupport = therapist.getServices();
                if (!serviceSupport.contains(service)) {
                    throw new AppException(ErrorCode.THERAPIST_NOT_SUPPORTED);
                }
                session.setTherapist(therapist);
            }
        }

        session.setBookingDate(request.getSessionDateTime().toLocalDate());
        session.setBooking(booking);

        //Set status for session base on payment status of booking
        if (booking.getPaymentStatus() == PaymentStatus.PAID || booking.getStatus() == BookingStatus.ON_GOING) {
            session.setStatus(BookingSessionStatus.WAITING);
        } else {
            session.setStatus(BookingSessionStatus.PENDING);
        }
        bookingSessionRepository.save(session);
        //Notification when session created, from second session
        if (session.getStatus() != BookingSessionStatus.PENDING) {
            int count = booking.getService().getSession() - booking.getSessionRemain() +1;
            String text = "Buổi "+ count +", dịch vụ "+session.getBooking().getService().getName()+" của bạn đã được lên lịch vào ngày "+request.getSessionDateTime().toLocalDate();
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .url("http://localhost:3000/sessionDetail/"+session.getId())
                    .text(text)
                    .userId(session.getBooking().getUser().getId())
                    .isRead(false)
                    .build();
            notificationService.create(notificationRequest);
        }

        int sessionNumber = 0;
        int sessionCompleted =0;
        List<BookingSession> sessionList = booking.getBookingSessions();
        if(sessionList != null && !sessionList.isEmpty()){
            for(BookingSession count : sessionList){
                if (count.getStatus() == BookingSessionStatus.COMPLETED){
                    sessionCompleted ++;
                }
            }
        }
        sessionNumber = sessionCompleted + 1;
        String description = "Buổi dịch vụ thứ " +sessionNumber+"/" +service.getSession()+" - "+service.getName() ;
        session.setDescription(description);
        bookingSessionRepository.save(session);
        bookingSessionRepository.flush();




        return bookingSessionMapper.toBookingSessionResponse(session);

    }
    public Page<BookingSessionResponse> getAllBookingSessions(Pageable pageale) {
        return bookingSessionRepository.findAll(pageale).map(bookingSessionMapper::toBookingSessionResponse);
    }
    public Page<BookingSessionResponse> getMySessions(Pageable pageale) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        List<Booking> bookings = bookingRepository.findAllByUserId(user.getId());
        return bookingSessionRepository.findAll(pageale).map(bookingSessionMapper::toBookingSessionResponse);
    }
    public BookingSessionResponse getBookingSessionById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (canAccessSession(id, authentication.getName(), authority.getAuthority())) {
                return bookingSessionMapper.toBookingSessionResponse(checkSession(id));
            }
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    private boolean canAccessSession(int sessionId, String username, String role) {
        Optional<BookingSession> sessionOpt = bookingSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return false;

        BookingSession session = sessionOpt.get();
        Booking booking = session.getBooking();

        switch (role) {
            case "ROLE_ADMIN":

            case "ROLE_STAFF":
                return true; // Staff can access all sessions
            case "ROLE_THERAPIST":
                return session.getTherapist() != null &&
                        session.getTherapist().getUser().getUsername().equals(username);
            case "ROLE_USER":
                return booking.getUser().getUsername().equals(username);
            default:
                return false; // Default deny
        }
    }
    @Transactional
    public BookingSessionResponse updateBookingSession(int id,
                                                       BookingSessionUpdateRequest request,
                                                       MultipartFile imgBefore,
                                                       MultipartFile imgAfter) throws IOException {
        BookingSession session = checkSession(id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User staff = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean isStaff = staff.getRoles().stream()
                .anyMatch(role -> role.getName().equals("STAFF"));  // Assuming your Role entity has a getName() method
        if(session.getStatus() == BookingSessionStatus.COMPLETED)
            throw new AppException(ErrorCode.SESSION_COMPLETED);
        if(request.getRoomId()!=null) {
            if(session.getRoom() != null){
                int inUse = session.getRoom().getInUse()-1;
                session.getRoom().setInUse(inUse);
            }
            session.setRoom(getRoomById(request.getRoomId()));
            roomService.incrementInUse(request.getRoomId());
        } else {
            List<Room> roomAvailableForService = roomService.getRoomAvailableForService(session.getBooking().getService().getId());
            if (roomAvailableForService.isEmpty()) {
                throw new AppException(ErrorCode.OUT_OF_ROOM);
            } else {
                Room room = roomAvailableForService.getFirst();
                session.setRoom(room);
                roomService.incrementInUse(room.getId());
            }
        }

        if (isStaff) {
            session.setStaff(staff);
            session.setStatus(BookingSessionStatus.ON_GOING);
            String text = "Buổi dịch vụ " + session.getBooking().getService().getName() + " của bạn sẽ được thực hiện tại phòng " + session.getRoom().getName();
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .url("http://localhost:3000/sessionDetail/" + session.getId())
                    .text(text)
                    .userId(session.getBooking().getUser().getId())
                    .isRead(false)
                    .build();
            notificationService.create(notificationRequest);
        }else {

        }

        bookingSessionMapper.updateBookingSession(session, request);
        if(request.getNote()!=null)
            session.setNote(request.getNote());


        if(imgBefore !=null && !imgBefore.isEmpty()) {
            if(session.getImgBefore()!=null)
                supabaseService.deleteImage(session.getImgBefore());
            session.setImgBefore(supabaseService.uploadImage(imgBefore, "imgBefore_" + session.getId()));
        }
        if(imgAfter !=null && !imgAfter.isEmpty()) {
            if(session.getImgAfter()!=null)
                supabaseService.deleteImage(session.getImgAfter());
            session.setImgAfter(supabaseService.uploadImage(imgAfter, "imgAfter_" + session.getId()));
        }
        bookingSessionRepository.save(session);
        bookingSessionRepository.flush();
        return bookingSessionMapper.toBookingSessionResponse(session);
    }


    @Transactional
    @PreAuthorize("hasAnyRole('STAFF','THERAPIST','ADMIN')")
    public BookingSession updateStatus(int id, SessionStatusRequest rq){
        BookingSession session = bookingSessionRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SESSION_NOT_EXISTED));

        LocalDateTime  now = LocalDateTime.now();
        if(now.isBefore(session.getSessionDateTime().minusMinutes(40))){
            throw new AppException(ErrorCode.BOOKING_IS_SOON_IN_TIME);
        }
        if(now.isAfter(session.getSessionDateTime().plusMinutes(20)))
            throw new AppException(ErrorCode.BOOKING_IS_LATE_IN_TIME);
        try {
            BookingSessionStatus sessionStatus = BookingSessionStatus.valueOf(rq.getStatus().toUpperCase());

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User staff = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            boolean isStaff = staff.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("STAFF"));

            Services service = session.getBooking().getService();
            String text = "";

            if (sessionStatus == BookingSessionStatus.ON_GOING) {
                if (!isStaff) {
                    throw new AppException(ErrorCode.NOT_HAVE_PERMISSIONS);
                }
                session.setStatus(sessionStatus);
                //Assign Room for session
                List<Room> roomAvailableForService = roomService.getRoomAvailableForService(service.getId());
                if (roomAvailableForService.isEmpty()) {
                    throw new AppException(ErrorCode.OUT_OF_ROOM);
                } else {
                    Room room = roomAvailableForService.getFirst();
                    session.setRoom(room);
                    roomService.incrementInUse(room.getId());
                }
                text = "Buổi dịch vụ "+session.getBooking().getService().getName()+" của bạn sẽ được thực hiện tại phòng "+session.getRoom().getName();
            } else if (sessionStatus == BookingSessionStatus.COMPLETED) {
                if (session.isFinished()) {
                    //Notification
                    text = "Buổi dịch vụ "+session.getBooking().getService().getName()+" của bạn đã hoàn tất";
                    NotificationRequest notificationRequest = NotificationRequest.builder()
                            .url("http://localhost:3000/sessionDetail/"+session.getId())
                            .text(text)
                            .userId(session.getBooking().getUser().getId())
                            .isRead(false)
                            .build();
                    notificationService.create(notificationRequest);

                    Booking booking = session.getBooking();
                    session.setStatus(BookingSessionStatus.COMPLETED);
                    LocalDateTime feedbackTime = LocalDateTime.now().plusDays(15);
                    session.setFeedBackTime(feedbackTime);
                    //Check status of bookingService
                    updateSessionRemain(booking.getId());
                    if (booking.getSessionRemain() == 0) {
                        booking.setStatus(BookingStatus.COMPLETED);
                    }
                    //Decrease in use in room
                    int roomId = session.getRoom().getId();
                    roomService.decrementInUse(roomId);
                    bookingRepository.save(booking);
                }else {
                    throw new AppException(ErrorCode.NOT_FINISH);
                }
            } else if (sessionStatus == BookingSessionStatus.IS_CANCELED) {
                if (session.getStatus() == BookingSessionStatus.ON_GOING) {
                    throw new AppException(ErrorCode.SESSION_ON_GOING);
                }
                if(rq.getMessage()!=null)
                    text = "Phiên điều trị "+session.getBooking().getService().getName() +" đã bị hủy"+rq.getMessage();
                else
                    text = "Phiên điều trị "+session.getBooking().getService().getName()+" của bạn đã bị huỷ";
                session.setStatus(sessionStatus);
            }
            //Notification
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .url("http://localhost:3000/sessionDetail/"+session.getId())
                    .text(text)
                    .userId(session.getBooking().getUser().getId())
                    .isRead(false)
                    .build();
            notificationService.create(notificationRequest);
            //Save session
            return bookingSessionRepository.save(session);
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.SESSION_STATUS_INVALID);
        }
    }
    private BookingSessionStatus getSessionStatus(String status){
        try {
            return BookingSessionStatus.valueOf(status.toUpperCase());
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.SESSION_STATUS_INVALID);
        }
    }
    public List<BookingSessionResponse> getSessionByBooking(int bookingId){
        Booking booking = getBookingById(bookingId);
        return bookingSessionRepository.findAllByBooking(booking).stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }

    public List<BookingSessionResponse> getSessionByPhone(String phone){
        return bookingSessionRepository.findByBookingUserPhone(phone).stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }

    @Transactional
    public void deleteBookingSession(int id) {
        BookingSession session = checkSession(id);
        bookingSessionRepository.delete(session);
    }

    BookingSession checkSession(int id) {
        return bookingSessionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SESSION_NOT_EXISTED));
    }

    Booking getBookingById(int id) {
        return bookingRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
    }
    Room getRoomById(int id) {
        return roomRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
    }
    Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

    public List<LocalTime> generateTimeSlots() {
        List<LocalTime> timeSlots = new ArrayList<>();
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0);

        while (startTime.plusMinutes(30).isBefore(endTime) || startTime.plusMinutes(30).equals(endTime)) {
            timeSlots.add(startTime);
            startTime = startTime.plusMinutes(30);
        }

        return timeSlots;
    }

    public List<TimeSlotAvailabilityResponse> getAvailableTimeSlotsForTherapist(
            String therapistId, int serviceId, LocalDate bookingDate) {
        if(bookingDate.isBefore(LocalDate.now()))
            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
        // Check if therapist exists
        Therapist therapist = getTherapistById(therapistId);

        // Check if service exists and get its duration
        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        int serviceDuration = service.getDuration();

        //If therapist is active
        if (therapist.getUser().isActive()) {
            // Verify therapist can perform this service
            boolean canProvideService = therapistRepository.existsByIdAndServices_Id(therapistId, serviceId);
            if (!canProvideService) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
        } else {
            throw new AppException(ErrorCode.THERAPIST_INACTIVE);
        }

        //Get all user session in day
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<BookingSessionStatus> statuses = List.of(BookingSessionStatus.IS_CANCELED);
        LocalDateTime from = bookingDate.atStartOfDay();
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<BookingSession> sessionsOfUser = bookingSessionRepository.findAllBookingSessionsByUserIdAndExcludedStatusesBetweenDates(user.getId(), statuses, from, to);



        // Generate all possible time slots for the day
        List<LocalTime> allTimeSlots = generateTimeSlots();

        // Get the therapist's bookings for the specified date
        LocalDateTime startOfDay = bookingDate.atTime(9, 0);
        LocalDateTime endOfDay = bookingDate.atTime(17, 0);

        List<BookingSessionStatus> excludeStatuses = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> therapistBookings = bookingSessionRepository.findByTherapistIdAndSessionDateTimeBetweenAndStatusNotIn(
                therapistId, startOfDay, endOfDay, excludeStatuses);

        // Filter out slots that overlap with existing bookings
        List<TimeSlotAvailabilityResponse> availableSlots = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now().plusHours(2);
        for (LocalTime slot : allTimeSlots) {
            // Find the next predefined slot that is greater than or equal to (start + serviceDuration)
            LocalTime expectedEndTime = slot.plusMinutes(serviceDuration);
            LocalTime endTime = allTimeSlots.stream()
                    .filter(t -> !t.isBefore(expectedEndTime)) // Get the first slot after expectedEndTime
                    .findFirst()
                    .orElse(LocalTime.of(17, 0)); // Default to 17:00 if no slot matches

            LocalDateTime slotStartDateTime = bookingDate.atTime(slot);
            LocalDateTime slotEndDateTime = bookingDate.atTime(endTime);

            if (bookingDate.isEqual(LocalDate.now()) && slotStartDateTime.isBefore(now)) {
                continue; // Skip this time slot
            }

            boolean isAvailable = true;

            for (BookingSession booking : therapistBookings) {
                LocalDateTime bookingStartTime = booking.getSessionDateTime();
                int bookingDuration = booking.getBooking().getService().getDuration();
                LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(bookingDuration);

                // Check if this slot would overlap with the booking
                if (slotStartDateTime.isBefore(bookingEndTime) && slotEndDateTime.isAfter(bookingStartTime)) {
                    isAvailable = false;
                    break;
                }
            }

            if (!sessionsOfUser.isEmpty()) {
                for (BookingSession session : sessionsOfUser) {
                    LocalDateTime startOfSession = session.getSessionDateTime();
                    LocalDateTime endOfSession = session.getSessionDateTime().plusMinutes(session.getBooking().getService().getDuration());
                    if (endOfSession.isAfter(slotStartDateTime) && startOfSession.isBefore(slotEndDateTime)) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            if (isAvailable) {
                availableSlots.add(new TimeSlotAvailabilityResponse(
                        slotStartDateTime.toLocalTime(),
                        slotEndDateTime.toLocalTime()
                ));
            }
        }

        return availableSlots;
    }

    /**
     * Method 2: Find all time slots that have at least one available therapist for a service
     * @param serviceId The ID of the service
     * @param bookingDate The date to check availability for
     * @return List of available time slots with corresponding available therapists
     */
    public List<TherapistAvailabilityResponse> getAvailableTimeSlotsWithAvailableTherapists(
            int serviceId, LocalDate bookingDate) {
        if(bookingDate.isBefore(LocalDate.now()))
            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
        // Check if service exists and get its duration
        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        int serviceDuration = service.getDuration();

        // Get all therapists who can provide this service
        List<Therapist> qualifiedTherapists =  therapistRepository.findAllByServicesIdAndUserActiveTrue(serviceId);

        if (qualifiedTherapists.isEmpty()) {
            return new ArrayList<>(); // No therapists can provide this service
        }

        //Get all user session in day
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<BookingSessionStatus> statuses = List.of(BookingSessionStatus.IS_CANCELED);
        LocalDateTime from = bookingDate.atStartOfDay();
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<BookingSession> sessionsOfUser = bookingSessionRepository.findAllBookingSessionsByUserIdAndExcludedStatusesBetweenDates(user.getId(), statuses, from, to);

        // Generate all possible time slots for the day
        List<LocalTime> allTimeSlots = generateTimeSlots();

        LocalTime currentTime = LocalTime.now().plusHours(2);
        if (bookingDate.isEqual(LocalDate.now())) {
            allTimeSlots = allTimeSlots.stream()
                    .filter(slot -> slot.isBefore(currentTime))
                    .collect(Collectors.toList());

            // If no available slots today after filtering, return empty list
            if (allTimeSlots.isEmpty()) {
                return new ArrayList<>();
            }
        }


        List<LocalTime> availableTimeSlots = new ArrayList<>(allTimeSlots);

        for (LocalTime slot : availableTimeSlots) {

            LocalTime expectedEndTime = slot.plusMinutes(serviceDuration);
            LocalTime endTime = allTimeSlots.stream()
                    .filter(t -> !t.isBefore(expectedEndTime)) // Get the first slot after expectedEndTime
                    .findFirst()
                    .orElse(LocalTime.of(17, 0)); // Default to 17:00 if no slot matches

            LocalDateTime slotStartDateTime = bookingDate.atTime(slot);
            LocalDateTime slotEndDateTime = bookingDate.atTime(endTime);

            if (!sessionsOfUser.isEmpty()) {
                for (BookingSession session : sessionsOfUser) {
                    LocalDateTime startOfSession = session.getSessionDateTime();
                    LocalDateTime endOfSession = startOfSession.plusMinutes(session.getBooking().getService().getDuration());
                    if (endOfSession.isAfter(slotStartDateTime) && startOfSession.isBefore(slotEndDateTime)) {
                        allTimeSlots.remove(slot);
                    }
                }
            }
        }
        // Map to store available therapists for each time slot
        Map<LocalTime, List<Therapist>> availableTherapistsMap = new HashMap<>();

        // Initialize all slots with all qualified therapists available
        for (LocalTime slot : allTimeSlots) {
            availableTherapistsMap.put(slot, new ArrayList<>(qualifiedTherapists));
        }

        // Get all bookings for the specified date
        LocalDateTime startOfDay = bookingDate.atTime(9, 0);
        LocalDateTime endOfDay = bookingDate.atTime(17, 0);

        List<BookingSessionStatus> excludeStatuses = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> allBookings = bookingSessionRepository.findBySessionDateTimeBetweenAndStatusNotIn(
                startOfDay, endOfDay, excludeStatuses);

        // Remove therapists from slots where they have bookings
        for (BookingSession booking : allBookings) {

            if (booking.getTherapist() != null) {
                String therapistId = booking.getTherapist().getId();

                LocalTime bookingStartTime = booking.getSessionDateTime().toLocalTime();
                int bookingDuration = booking.getBooking().getService().getDuration();
                LocalTime bookingEndTime = bookingStartTime.plusMinutes(bookingDuration);

                for (LocalTime slot : allTimeSlots) {
                    LocalTime slotEndTime = slot.plusMinutes(serviceDuration);

                    // Check if this slot would overlap with the booking
                    if (slot.isBefore(bookingEndTime) && slotEndTime.isAfter(bookingStartTime)) {
                        availableTherapistsMap.get(slot).removeIf(
                                therapist -> therapist.getId().equals(therapistId)
                        );
                    }
                }
            }
        }

        // Count bookings per therapist to determine workload
        Map<String, Integer> therapistBookingCount = new HashMap<>();

        // Initialize booking counts to zero for all therapists
        for (Therapist therapist : qualifiedTherapists) {
            therapistBookingCount.put(therapist.getId(), 0);
        }

        // Count existing bookings for each therapist
        for (BookingSession booking : allBookings) {
            String therapistId = booking.getTherapist().getId();
            therapistBookingCount.merge(therapistId, 1, Integer::sum);
        }

        // Convert to response objects, selecting the least booked therapist for each slot
        List<TherapistAvailabilityResponse> availabilitySlots = new ArrayList<>();
        LocalTime now = LocalTime.now().plusHours(2);
        for (LocalTime slot : allTimeSlots) {
            // Find the next predefined slot that is greater than or equal to (start + serviceDuration)
            LocalTime expectedEndTime = slot.plusMinutes(serviceDuration);
            LocalTime endTime = allTimeSlots.stream()
                    .filter(t -> !t.isBefore(expectedEndTime)) // Find the first time slot after expectedEndTime
                    .findFirst()
                    .orElse(LocalTime.of(18, 0)); // Default to 17:00 if no slot matches
            if (bookingDate.isEqual(LocalDate.now()) && (endTime.isBefore(now)||slot.isBefore(now))) {
                continue; // Skip this time slot
            }
            List<Therapist> availableTherapists = availableTherapistsMap.get(slot);
            if (!availableTherapists.isEmpty()) {
                // Find the therapist with the lowest booking count
                Therapist selectedTherapist = availableTherapists.stream()
                        .min(Comparator.comparing(therapist -> therapistBookingCount.get(therapist.getId())))
                        .orElse(availableTherapists.get(0));

                // Create the response ensuring time slot aligns with predefined slots
                TherapistAvailabilityResponse timeSlot = new TherapistAvailabilityResponse(
                        selectedTherapist.getId(),
                        slot,
                        endTime
                );

                availabilitySlots.add(timeSlot);

                // Increment therapist booking count
                therapistBookingCount.put(selectedTherapist.getId(),
                        therapistBookingCount.get(selectedTherapist.getId()) + 1);
            }
        }

        return availabilitySlots;
    }

    public boolean isTherapistAvailable(String therapistId, LocalDateTime requestTime, int requestDuration) {
        if(requestTime.isBefore(LocalDateTime.now()))
            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
        LocalDateTime startOfDay = requestTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // Define statuses to exclude from active bookings
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED);

        // Fetch all active bookings for the therapist within the day
        List<BookingSession> existingBookings = bookingSessionRepository
                .findByTherapistIdAndSessionDateTimeBetweenAndStatusNotIn(therapistId, startOfDay, endOfDay, excludeStatus);

        // Calculate requested session's end time
        LocalDateTime requestEndTime = requestTime.plusMinutes(requestDuration);

        // Check for scheduling conflicts
        for (BookingSession existing : existingBookings) {
            LocalDateTime existingStartTime = existing.getSessionDateTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(existing.getBooking().getService().getDuration());

            if (isOverlapping(requestTime, requestEndTime, existingStartTime, existingEndTime)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if two time intervals overlap.
     */
    private boolean isOverlapping(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        return (start1.isBefore(end2) && end1.isAfter(start2)) ||
                start1.isEqual(start2) || end1.isEqual(end2);
    }

    void updateSessionRemain(int id) {
        Booking booking = getBookingById(id);
        int remain = booking.getSessionRemain();
        remain -= 1;
        booking.setSessionRemain(remain);
        bookingRepository.save(booking);
    }

    public boolean isAllowToCreate(int bookingId, LocalDate requestDate) {
        Booking booking = getBookingById(bookingId);
        List<BookingSession> existedList = booking.getBookingSessions();
        //Check session type
        if (booking.getService().getServiceCategory().getType() == ServiceType.TREATMENT) {
            if (existedList != null && !existedList.isEmpty()) {
//                if  (existedList.size() > 0) {
                    BookingSession lastSessionCompleted = null;
                    for (BookingSession session : existedList) {
                        if (session.getStatus() == BookingSessionStatus.COMPLETED) {
                            lastSessionCompleted = session;
                        }
                    }

                    if(lastSessionCompleted !=null) {
                        LocalDate lastSessionDateValid = lastSessionCompleted.getBookingDate().plusDays(7);
                        if (requestDate.isBefore(lastSessionDateValid)) {
                            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                        }
                    }
//                }

            }
        }

        if (booking.getService().getServiceCategory().getType() == ServiceType.RESTORATION || booking.getService().getServiceCategory().getType() == ServiceType.CLEANSING) {
            if (existedList != null && !existedList.isEmpty()) {
                if  (existedList.size() > 1) {
                    BookingSession lastSessionCompleted = null;
                    for (BookingSession session : existedList) {
                        if (session.getStatus() == BookingSessionStatus.COMPLETED) {
                            lastSessionCompleted = session;
                        }
                    }

                    if(lastSessionCompleted !=null) {
                        LocalDate lastSessionDateValid = lastSessionCompleted.getBookingDate();
                        if (requestDate.equals(lastSessionDateValid)) {
                            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                        }
                    }
                }

            }
        }


        if (existedList != null && !existedList.isEmpty()) {
            List<BookingSession> existedSession = new ArrayList<>(existedList);
            BookingSession lastSession = existedSession.getLast();
            LocalDate dateOfLastSession = lastSession.getBookingDate();
            //Check status of last session
            if(lastSession.getStatus() != BookingSessionStatus.IS_CANCELED ){

                if (lastSession.getStatus() != BookingSessionStatus.COMPLETED) {
                    throw new AppException(ErrorCode.CURRENT_SESSION_NOT_COMPLETED);
                }
                //Check date to create new bookingSession
                if (!requestDate.isAfter(dateOfLastSession)) {
                    throw new AppException(ErrorCode.BOOKING_DATE_NOT_EXCEPTION);
                }
            }
            //Check session remain
            int maxSessionAllow = booking.getService().getSession();
            int actualComplete = 0;
            for (BookingSession bookingSession : existedSession) {
                if (bookingSession.getStatus() == BookingSessionStatus.COMPLETED) {
                    actualComplete++;
                }
            }
            if (actualComplete >= maxSessionAllow) {
                throw new AppException(ErrorCode.MAX_SESSION_REACHED);
            }
        }

        Set<Booking> totalBookingOfUser = booking.getUser().getBooking();
        for (Booking bookingExists : totalBookingOfUser) {
            List<BookingSession> sessionExistedList = bookingExists.getBookingSessions();
            for (BookingSession sessionExists : sessionExistedList) {
                if (sessionExists.getStatus() == BookingSessionStatus.COMPLETED) {
                    if (!requestDate.isAfter(sessionExists.getBookingDate())) {
                        throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                    }
                }
            }
        }
        return true;
    }

    public Page<BookingSessionResponse> getByUser(String status, Pageable pageable){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String userId = user.getId();
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("booking").get("user").get("id"), userId));
            if (status != null) {
                try {
                    BookingSessionStatus sessionStatus = BookingSessionStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), sessionStatus));
                } catch (IllegalArgumentException e) {
                    throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return bookingSessionRepository.findAll(spec,pageable).map(bookingSessionMapper::toBookingSessionResponse);
    }

    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public Page<BookingSessionResponse> getAll(String status, LocalDate startDate, LocalDate endDate, Pageable pageable){
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty()) {
                try {
                    BookingSessionStatus sessionStatus = BookingSessionStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), sessionStatus));
                } catch (IllegalArgumentException e) {
                    throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
                }
            }
            if (startDate != null && endDate != null) {
                predicates.add(cb.between(root.get("sessionDateTime"), startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
            } else if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sessionDateTime"), startDate.atStartOfDay()));
            } else if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sessionDateTime"), endDate.atTime(23, 59, 59)));
            } else {
                predicates.add(cb.between(root.get("sessionDateTime"), LocalDate.now().atStartOfDay(), LocalDate.now().plusDays(7).atTime(23, 59, 59)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return bookingSessionRepository.findAll(spec,pageable).map(bookingSessionMapper::toBookingSessionResponse);
    }
    @Transactional
    public BookingSession cancelByUser(int sessionId) {
        BookingSession session = checkSession(sessionId);
        User user = session.getBooking().getUser();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!user.getUsername().equals(authentication.getName()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        if(session.getStatus() == BookingSessionStatus.ON_GOING || session.getStatus() == BookingSessionStatus.COMPLETED)
            throw new AppException(ErrorCode.CANT_CANCEL);
        session.setStatus(BookingSessionStatus.IS_CANCELED);
        String text = "Buổi dịch vụ "+session.getBooking().getService().getName()+" của bạn đã được hủy.";
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .url("http://localhost:3000/sessionDetail/"+session.getId())
                .text(text)
                .userId(session.getBooking().getUser().getId())
                .isRead(false)
                .build();
        notificationService.create(notificationRequest);
        return bookingSessionRepository.save(session);
    }

    @PreAuthorize("hasRole('THERAPIST')")
    public List<BookingSessionResponse> getTherapistSchedule (LocalDate startDate,LocalDate endDate){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        LocalDateTime endDateTime = endDate.atTime(0,0);
        if(endDate.equals(startDate))
            endDateTime=startDate.atTime(23,0);
        List<BookingSessionStatus> excludeStatuses = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> sessions = bookingSessionRepository.findByTherapist_IdAndSessionDateTimeBetweenAndStatusNotIn(user.getTherapist().getId(),
                startDate.atTime(0,0),endDateTime, excludeStatuses);

        return sessions.stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }

    @Scheduled(fixedRate = 60000) // Runs every 60 seconds (adjust as needed)
    public void autoCancelExpiredSessions() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);

        List<BookingSession> expiredSessions = bookingSessionRepository
                .findByStatusInAndSessionDateTimeBefore(
                        List.of(BookingSessionStatus.WAITING, BookingSessionStatus.PENDING),
                        threshold
                );

        expiredSessions.forEach(session -> session.setStatus(BookingSessionStatus.IS_CANCELED));
        bookingSessionRepository.saveAll(expiredSessions);

        System.out.println("Auto-canceled " + expiredSessions.size() + " expired sessions.");
    }

    public Page<BookingSessionDTO> getAllSessionFinishByTherapistBetween(Pageable pageable, LocalDate from, LocalDate to) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user  = userRepository.findByUsername(authentication.getName()).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        Therapist therapist = user.getTherapist();
        BookingSessionStatus status = BookingSessionStatus.COMPLETED;
        LocalDateTime start;
        LocalDateTime end;
        if (to == null) {
            end = LocalDate.now().atStartOfDay().plusDays(1).minusNanos(1);
        } else {
            end = to.atStartOfDay().plusDays(1).minusNanos(1);
        }
        if (from == null) {
            start = LocalDate.now().atStartOfDay().minusDays(6);
        } else {
            start = from.atStartOfDay();
        }
        Page<BookingSession> sessionsList = bookingSessionRepository.findAllByTherapistAndSessionDateTimeBetweenAndStatus(pageable, therapist, start, end, status);
        return sessionsList.map(bookingSessionMapper::toSessionDto);
    }

}
