"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { differenceInMinutes } from "date-fns";

import { getUpcomingInterviews } from "@/services/applications.service";

export function InterviewNotifications() {
    const { data = [] } =
        useQuery({
            queryKey: [
                "upcoming-interviews",
            ],

            queryFn:
                getUpcomingInterviews,
        });

    useEffect(() => {
        if (
            typeof window ===
            "undefined"
        ) {
            return;
        }

        const setupNotifications =
            async () => {
                let permission =
                    Notification.permission;

                if (
                    permission ===
                    "default"
                ) {
                    permission =
                        await Notification.requestPermission();
                }

                if (
                    permission !==
                    "granted"
                ) {
                    return;
                }

                data.forEach(
                    (interview: any) => {
                        if (
                            !interview.interviewDate
                        ) {
                            return;
                        }

                        const minutesLeft =
                            differenceInMinutes(
                                new Date(
                                    interview.interviewDate,
                                ),
                                new Date(),
                            );

                        const alreadyNotified =
                            sessionStorage.getItem(
                                `interview-notified-${interview.id}`,
                            );

                        if (
                            minutesLeft <=
                            60 &&
                            minutesLeft > 0 &&
                            !alreadyNotified
                        ) {
                            new Notification(
                                "Upcoming Interview",
                                {
                                    body: `${interview.company} • ${interview.role} starts in ${minutesLeft} minutes`,
                                },
                            );

                            sessionStorage.setItem(
                                `interview-notified-${interview.id}`,
                                "true",
                            );
                        }
                    },
                );
            };

        setupNotifications();

        if (
            Notification.permission !==
            "granted"
        ) {
            return;
        }

        data.forEach(
            (interview: any) => {
                if (
                    !interview.interviewDate
                ) {
                    return;
                }

                const minutesLeft =
                    differenceInMinutes(
                        new Date(
                            interview.interviewDate,
                        ),
                        new Date(),
                    );

                const alreadyNotified =
                    sessionStorage.getItem(
                        `interview-notified-${interview.id}`,
                    );

                if (
                    minutesLeft <=
                    60 &&
                    minutesLeft > 0 &&
                    !alreadyNotified
                ) {
                    new Notification(
                        "Upcoming Interview",
                        {
                            body: `${interview.company} • ${interview.role} starts in ${minutesLeft} minutes`,
                        },
                    );

                    sessionStorage.setItem(
                        `interview-notified-${interview.id}`,
                        "true",
                    );
                }
            },
        );
    }, [data]);

    return null;
}