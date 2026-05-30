import {
    Body,
    Controller,
    Post,
} from "@nestjs/common";

import { CurrentUser } from "../common/decorators/current-user.decorator";

import { CreateFollowUpReminderDto } from "./dto/create-follow-up-reminder.dto";

import { RemindersService } from "./reminders.service";

import { UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Param, Get } from "@nestjs/common";

@UseGuards(JwtAuthGuard)

@Controller("reminders")
export class RemindersController {
    constructor(
        private remindersService: RemindersService,
    ) { }

    @Post("follow-up")
    async createFollowUpReminder(
        @CurrentUser() user: any,

        @Body()
        dto: CreateFollowUpReminderDto,
    ) {
        return this.remindersService.createFollowUpReminder(
            user.userId,
            dto,
        );
    }

    @Get("application/:id")
    async getApplicationReminders(
        @CurrentUser() user: any,

        @Param("id")
        applicationId: string,
    ) {
        return this.remindersService.getApplicationReminders(
            user.userId,

            applicationId,
        );
    }

    @Get()
    async getPendingReminders(
        @CurrentUser() user: any,
    ) {
        return this.remindersService.getPendingReminders(
            user.userId,
        );
    }
}