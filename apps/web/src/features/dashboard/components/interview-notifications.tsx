"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { differenceInMinutes } from "date-fns";

import { areInterviewNotificationsEnabled } from "@/lib/preferences";
import { getUpcomingInterviews } from "@/services/applications.service";

export function InterviewNotifications() {
  const { data = [] } = useQuery({
    queryKey: ["upcoming-interviews"],
    queryFn: getUpcomingInterviews,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!areInterviewNotificationsEnabled()) {
      return;
    }

    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    data.forEach((interview: {
      id: string;
      company: string;
      role: string;
      interviewDate?: string;
    }) => {
      if (!interview.interviewDate) {
        return;
      }

      const minutesLeft = differenceInMinutes(
        new Date(interview.interviewDate),
        new Date(),
      );

      const alreadyNotified = sessionStorage.getItem(
        `interview-notified-${interview.id}`,
      );

      if (minutesLeft <= 60 && minutesLeft > 0 && !alreadyNotified) {
        new Notification("Upcoming interview", {
          body: `${interview.company} · ${interview.role} starts in ${minutesLeft} minutes`,
        });

        sessionStorage.setItem(
          `interview-notified-${interview.id}`,
          "true",
        );
      }
    });
  }, [data]);

  return null;
}
