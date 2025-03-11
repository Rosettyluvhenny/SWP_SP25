package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.entity.BlogPost;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.repository.BlogPostRepository;
import com.SWP.SkinCareService.repository.BookingSessionRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CustomSecurityService {

    BookingSessionRepository sessionRepository;

    /**
     * Check if the current user is allowed to access the session
     */
    public boolean canAccessSession(int sessionId, String username, String role) {
        Optional<BookingSession> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return false;

        BookingSession session = sessionOpt.get();
        Booking booking = session.getBooking();

        if ("ROLE_STAFF".equals(role)) {
            return true; // Staff can access all sessions
        }
        if ("ROLE_THERAPIST".equals(role)) {
            return session.getTherapist() != null && session.getTherapist().getUser().getUsername().equals(username);
        }
        if ("ROLE_USER".equals(role)) {
            return booking.getUser().getUsername().equals(username);
        }

        return false; // Default deny
    }

    BlogPostRepository blogPostRepository;


    TherapistRepository therapistRepository;

    /**
     * Check if the authenticated user owns the therapist account that created the blog post.
     */
    public boolean canEditBlogPost(Integer blogPostId, String userId) {
        Optional<BlogPost> blogPostOpt = blogPostRepository.findById(blogPostId);
        if (blogPostOpt.isEmpty()) return false;

        BlogPost blogPost = blogPostOpt.get();

        // Get the therapist who created the blog post
        Therapist therapist = blogPost.getTherapist();

        if (therapist == null) return false;

        // Check if this therapist belongs to the authenticated user
        return therapist.getUser().getId().equals(userId);
    }
}
