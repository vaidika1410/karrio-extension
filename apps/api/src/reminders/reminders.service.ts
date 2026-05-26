import {
  Injectable,
} from "@nestjs/common";

import { Cron } from "@nestjs/schedule";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RemindersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Cron("* * * * *")
  async processReminders() {
    const now = new Date();

    const reminders =
      await this.prisma.reminder.findMany({
        where: {
          sent: false,

          remindAt: {
            lte: now,
          },
        },
      });

    for (const reminder of reminders) {
      console.log(
        `Reminder Triggered: ${reminder.title}`,
      );

      await this.prisma.reminder.update({
        where: {
          id: reminder.id,
        },

        data: {
          sent: true,
        },
      });
    }
  }
}