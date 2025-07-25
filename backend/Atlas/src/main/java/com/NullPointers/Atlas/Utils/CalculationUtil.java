package com.NullPointers.Atlas.Utils;

import java.time.LocalDate;

public class CalculationUtil {
    public static int MinuteToHours(int minutes) {
        return minutes / 60;
    }

    public static int HoursToMinutes(int hours) {
        return hours*60;
    }

    public static int calculateTimeRemainingFromCalendar() {
        return 100;
    }

    public static int calculateTimeToBeAssigned(int maxTimePerDay, LocalDate startDate, LocalDate endDate) {
        return 100; // place holder (should be replaced with actual logic)
    }
}
