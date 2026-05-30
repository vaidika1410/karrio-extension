import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

import { ReminderType } from '../../generated/prisma';

import { CreateFollowUpReminderDto } from './dto/create-follow-up-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async createReminder({
    title,
    message,
    remindAt,
    type,
    userId,
    applicationId,
  }: {
    title: string;

    message?: string;

    remindAt: Date;

    type: ReminderType;

    userId: string;

    applicationId?: string;
  }) {
    if (applicationId) {
      const existingReminder = await this.prisma.reminder.findFirst({
        where: {
          userId,

          applicationId,

          type,

          sent: false,
        },
      });

      if (existingReminder) {
        return this.prisma.reminder.update({
          where: {
            id: existingReminder.id,
          },

          data: {
            title,

            message,

            remindAt,
          },
        });
      }
    }

    return this.prisma.reminder.create({
      data: {
        title,

        message,

        remindAt,

        type,

        userId,

        applicationId,
      },
    });
  }

  async createFollowUpReminder(
    userId: string,

    dto: CreateFollowUpReminderDto,
  ) {
    const application = await this.prisma.application.findFirst({
      where: {
        id: dto.applicationId,

        userId,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    let remindAt: Date;

    if (dto.remindAt) {
      remindAt = new Date(dto.remindAt);
    } else if (dto.days) {
      remindAt = new Date();

      remindAt.setDate(remindAt.getDate() + dto.days);
    } else {
      throw new BadRequestException('Reminder date or day offset is required');
    }

    if (Number.isNaN(remindAt.getTime())) {
      throw new BadRequestException('Invalid reminder date');
    }

    const existingReminder = await this.prisma.reminder.findFirst({
      where: {
        userId,

        applicationId: application.id,

        type: ReminderType.FOLLOW_UP,

        sent: false,
      },
    });

    if (existingReminder) {
      return this.prisma.reminder.update({
        where: {
          id: existingReminder.id,
        },

        data: {
          remindAt,

          message: `Follow up with ${application.company} for ${application.role}`,
        },
      });
    }

    return this.createReminder({
      title: 'Follow-Up Reminder',

      message: `Follow up with ${application.company} for ${application.role}`,

      remindAt,

      type: ReminderType.FOLLOW_UP,

      userId,

      applicationId: application.id,
    });
  }

  async getApplicationReminders(
    userId: string,

    applicationId: string,
  ) {
    return this.prisma.reminder.findMany({
      where: {
        userId,

        applicationId,

        sent: false,
      },

      orderBy: {
        remindAt: 'asc',
      },
    });
  }

  async getPendingReminders(userId: string) {
    return this.prisma.reminder.findMany({
      where: {
        userId,

        sent: false,
      },

      include: {
        application: true,
      },

      orderBy: {
        remindAt: 'asc',
      },

      take: 10,
    });
  }

  @Cron('* * * * *')
  async processReminders() {
    const now = new Date();

    const reminders = await this.prisma.reminder.findMany({
      where: {
        sent: false,

        remindAt: {
          lte: now,
        },
      },
    });

    for (const reminder of reminders) {
      console.log(`Reminder Triggered: ${reminder.title}`);

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
