import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";

import { ApplicationsService } from "./applications.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UpdateApplicationDto } from "./dto/update-application.dto";

import { CreateApplicationDto } from "./dto/create-application.dto";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
    constructor(
        private applicationsService: ApplicationsService,
    ) { }

    @Post()
    create(
        @CurrentUser() user: any,
        @Body()
        createApplicationDto: CreateApplicationDto,
    ) {
        return this.applicationsService.create(
            user.userId,
            createApplicationDto,
        );
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.applicationsService.findAll(
            user.userId,
        );
    }

    @Get("upcoming-interviews")
    getUpcomingInterviews(
        @CurrentUser() user: any,
    ) {
        return this.applicationsService.getUpcomingInterviews(
            user.userId,
        );
    }

    @Get(":id")
    findOne(
        @CurrentUser() user: any,
        @Param("id") id: string,
    ) {
        return this.applicationsService.findOne(
            user.userId,
            id,
        );
    }


    @Patch(":id")
    update(
        @CurrentUser() user: any,

        @Param("id") id: string,

        @Body()
        updateApplicationDto: UpdateApplicationDto,
    ) {
        return this.applicationsService.update(
            user.userId,
            id,
            updateApplicationDto,
        );
    }

    @Delete(":id")
    remove(
        @CurrentUser() user: any,
        @Param("id") id: string,
    ) {
        return this.applicationsService.remove(
            user.userId,
            id,
        );
    }
}