/*
package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.exception.MultipleParameterValidationException;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class  BookingSessionService {
    BookingSessionRepository bookingSessionRepository;
    BookingSessionMapper bookingSessionMapper;
    BookingRepository bookingRepository;
    TherapistRepository therapistRepository;
    SupabaseService supabaseService;
    FeedbackRepository feedbackRepository;
    RoomService roomService;

    public BookingSessionResponse createBookingSession(BookingSessionRequest request) {
        //Check booking
        Booking booking = getBookingById(request.getBookingId());
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());

        //Create session
        BookingSession session = bookingSessionMapper.toBookingSession(request);
        session.setBooking(booking);
        session.setTherapist(therapist);

        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public List<BookingSessionResponse> getAllBookingSessions() {
        return bookingSessionRepository.findAll().stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }
    public List<BookingSessionResponse> getAllBookingNullTherapist() {
        List<BookingSession> list = bookingSessionRepository.findAll();

        list.removeIf(bookingSession -> bookingSession.getTherapist() != null);

        if (list.isEmpty()) {
            return List.of();
        } else {
            return list.stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
        }
    }
    public BookingSessionResponse getBookingSessionById(int id) {
        return bookingSessionMapper.toBookingSessionResponse(checkSession(id));
    }
    public BookingSessionResponse updateBefore(int id,SessionUpdateRequest request, MultipartFile img) throws IOException {
        BookingSession session = checkSession(id);
        //Assign staffID
        //----------------------------------------------

        //Ordinal number of the session in the booking
        int sessionNum = 0;
        Booking booking = session.getBooking();
        List<BookingSession> list = booking.getBookingSessions();
        for (BookingSession bookingSession : list) {
            if (session.getId() == bookingSession.getId()) {
                sessionNum = list.indexOf(bookingSession)+1;
            }
        }
        //Set the image before session start
        if (img == null || img.isEmpty()) {
            throw new MultipleParameterValidationException(Collections.singletonList("img"));
        }
        String imgBefore = supabaseService.uploadImage(img,"Before_session"+sessionNum+"_booking"+booking.getId());
        session.setImgBefore(imgBefore);
        session.setNote(request.getNote());
        //Save and response
        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public BookingSessionResponse updateAfter(int id, SessionUpdateRequest request, MultipartFile img) throws IOException {
        BookingSession session = checkSession(id);
        if (session.getImgBefore() == null) {
            throw new AppException(ErrorCode.UPDATE_NOT_ALLOWED);
        }
        //Ordinal number of the session in the booking
        int sessionNum = 0;
        Booking booking = session.getBooking();
        List<BookingSession> list = booking.getBookingSessions();
        for (BookingSession bookingSession : list) {
            if (session.getId() == bookingSession.getId()) {
                sessionNum = list.indexOf(bookingSession)+1;
            }
        }
        //Set the image after session finish
        if (img == null || img.isEmpty()) {
            throw new MultipleParameterValidationException(Collections.singletonList("img"));
        }
        String imgAfter = supabaseService.uploadImage(img,"After_session"+sessionNum+"_booking"+booking.getId());
        session.setImgAfter(imgAfter);
        session.setNote(request.getNote());

        if (session.isFinished()) {
            session.setStatus(BookingSessionStatus.COMPLETED);
            //Check status of bookingService
            booking.setSessionRemain(booking.getSessionRemain()-1);
            if (booking.getSessionRemain() == 0) {
                booking.setStatus(BookingStatus.COMPLETED);
            }
            //Decrease in use in room
            int roomId = session.getRoom().getId();
            roomService.decrementInUse(roomId);
            //Create feedback
            Feedback feedback = new Feedback();
            //Set data
            feedback.setServiceId(booking.getService().getId());
            feedback.setBookingSession(session);
            feedback.setUser(booking.getUser());
            feedback.setTherapistId(session.getTherapist().getId());
            feedback.setRated(false);
            //Save
            feedbackRepository.save(feedback);

            bookingRepository.save(booking);
        }


        //Save and response
        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public BookingSessionResponse assignTherapistToSession(int id, SessionUpdateRequest request) {
        BookingSession session = checkSession(id);
        Therapist therapist = getTherapistById(request.getTherapistId());
        session.setTherapist(therapist);
        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }


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
    Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

}

 */
package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TherapistAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TimeSlotAvailabilityResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

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
    FeedbackRepository feedbackRepository;

    public BookingSessionResponse createBookingSession(BookingSessionRequest request) {

        Booking booking = getBookingById(request.getBookingId());

        BookingSession session = bookingSessionMapper.toBookingSession(request);
        System.out.println(session);
        Services service = booking.getService();

        if (request.getTherapistId() != null){
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
        //session.setBookingDate(request.getSessionDateTime().toLocalDate());
        session.setBooking(booking);
        session.setStatus(BookingSessionStatus.PENDING);
        bookingSessionRepository.save(session);
        updateSessionRemain(request.getBookingId());

        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public List<BookingSessionResponse> getAllBookingSessions() {
        return bookingSessionRepository.findAll().stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }
    public BookingSessionResponse getBookingSessionById(int id) {
        return bookingSessionMapper.toBookingSessionResponse(checkSession(id));
    }
    public BookingSessionResponse updateBookingSession(int id,
                                                       BookingSessionUpdateRequest request,
                                                       MultipartFile imgBefore,
                                                       MultipartFile imgAfter) throws IOException {
        BookingSession session = checkSession(id);

        Room room = getRoomById(request.getRoomId());

        if (request.getTherapistId() != null){
            Therapist therapist = getTherapistById(request.getTherapistId());
            session.setTherapist(therapist);
        }


        bookingSessionMapper.updateBookingSession(session, request);

        if(request.getRoomId()!=null)
            session.setRoom(getRoomById(request.getRoomId()));

        if(request.getStatus()!=null)
            session.setStatus(getSessionStatus(request.getStatus()));
        if(request.getNote()!=null)
            session.setNote(request.getNote());


        if(!imgBefore.isEmpty()) {
            session.setImgBefore(supabaseService.uploadImage(imgBefore, "imgBefore_" + session.getId()));
        }
        if(!imgAfter.isEmpty()) {
            session.setImgAfter(supabaseService.uploadImage(imgAfter, "imgAfter_" + session.getId()));
        }

        if (session.isFinished()) {
            Booking booking = session.getBooking();
            session.setStatus(BookingSessionStatus.COMPLETED);
            //Check status of bookingService
            booking.setSessionRemain(booking.getSessionRemain()-1);
            if (booking.getSessionRemain() == 0) {
                booking.setStatus(BookingStatus.COMPLETED);
            }
            //Decrease in use in room
            int roomId = session.getRoom().getId();
            roomService.decrementInUse(roomId);
            //Create feedback
            Feedback feedback = new Feedback();
            //Set data
            feedback.setServiceId(booking.getService().getId());
            feedback.setBookingSession(session);
            feedback.setUser(booking.getUser());
            feedback.setTherapistId(session.getTherapist().getId());
            feedback.setRated(false);
            //Save
            feedbackRepository.save(feedback);

            bookingRepository.save(booking);
        }

        bookingSessionRepository.save(session);
        bookingSessionRepository.flush();
        return bookingSessionMapper.toBookingSessionResponse(session);
    }

    public void updateStatus(int id, String status){
        BookingSession bookingSession = bookingSessionRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SESSION_NOT_EXISTED));
        try {
            BookingSessionStatus sessionStatus = BookingSessionStatus.valueOf(status.toUpperCase());
            bookingSession.setStatus(sessionStatus);
            bookingSessionRepository.save(bookingSession);
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

        // Verify therapist can perform this service
        boolean canProvideService = therapistRepository.existsByIdAndServices_Id(therapistId, serviceId);
        if (!canProvideService) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }

        // Generate all possible time slots for the day
        List<LocalTime> allTimeSlots = generateTimeSlots();

        // Get the therapist's bookings for the specified date
        LocalDateTime startOfDay = bookingDate.atTime(9, 0);
        LocalDateTime endOfDay = bookingDate.atTime(17, 0);

        List<BookingSessionStatus> excludeStatuses = List.of(BookingSessionStatus.IS_CANCELED, BookingSessionStatus.WAITING);
        List<BookingSession> therapistBookings = bookingSessionRepository.findByTherapistIdAndSessionDateTimeBetweenAndStatusNotIn(
                therapistId, startOfDay, endOfDay, excludeStatuses);

        // Filter out slots that overlap with existing bookings
        List<TimeSlotAvailabilityResponse> availableSlots = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
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
        List<Therapist> qualifiedTherapists = therapistRepository.findAllByServicesId(serviceId);

        if (qualifiedTherapists.isEmpty()) {
            return new ArrayList<>(); // No therapists can provide this service
        }

        // Generate all possible time slots for the day
        List<LocalTime> allTimeSlots = generateTimeSlots();

        // Map to store available therapists for each time slot
        Map<LocalTime, List<Therapist>> availableTherapistsMap = new HashMap<>();

        // Initialize all slots with all qualified therapists available
        for (LocalTime slot : allTimeSlots) {
            availableTherapistsMap.put(slot, new ArrayList<>(qualifiedTherapists));
        }

        // Get all bookings for the specified date
        LocalDateTime startOfDay = bookingDate.atTime(9, 0);
        LocalDateTime endOfDay = bookingDate.atTime(17, 0);

        List<BookingSessionStatus> excludeStatuses = List.of(BookingSessionStatus.IS_CANCELED,BookingSessionStatus.WAITING,BookingSessionStatus.PENDING);
        List<BookingSession> allBookings = bookingSessionRepository.findBySessionDateTimeBetweenAndStatusNotIn(
                startOfDay, endOfDay, excludeStatuses);

        // Remove therapists from slots where they have bookings
        for (BookingSession booking : allBookings) {
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
        LocalTime now = LocalTime.now();
        for (LocalTime slot : allTimeSlots) {
            // Find the next predefined slot that is greater than or equal to (start + serviceDuration)
            LocalTime expectedEndTime = slot.plusMinutes(serviceDuration);
            LocalTime endTime = allTimeSlots.stream()
                    .filter(t -> !t.isBefore(expectedEndTime)) // Find the first time slot after expectedEndTime
                    .findFirst()
                    .orElse(LocalTime.of(18, 0)); // Default to 17:00 if no slot matches

            if (bookingDate.isEqual(LocalDate.now()) && endTime.isBefore(now)) {
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
        LocalDateTime startOfDay = requestTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // Define statuses to exclude from active bookings
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED,BookingSessionStatus.PENDING,BookingSessionStatus.WAITING);

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
        List<BookingSession> list = booking.getBookingSessions();
        int remain = 0;
        for (BookingSession bookingSession : list) {
            if (bookingSession.getStatus() != BookingSessionStatus.COMPLETED && bookingSession.getStatus() != BookingSessionStatus.IS_CANCELED) {
                remain++;
            }
        }
        booking.setSessionRemain(remain);
        bookingRepository.save(booking);
    }


}
