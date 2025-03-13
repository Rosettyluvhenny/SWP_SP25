package com.SWP.SkinCareService.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum BookingStatus {
    PENDING,
    ON_GOING,
    IS_CANCELLED,
    COMPLETED
}