import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) { }

  async create(
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ) {

    const existing =
      await this.prisma.application.findFirst({
        where: {
          userId,

          role: createApplicationDto.role,

          company: createApplicationDto.company,

          jobUrl: createApplicationDto.jobUrl,
        },
      });

    if (existing) {
      throw new BadRequestException(
        "Application already exists",
      );
    }

    const application =
      await this.prisma.application.create({
        data: {
          ...createApplicationDto,
          userId,
        },
      });

    await this.prisma.applicationActivity.create({
      data: {
        applicationId:
          application.id,

        type: "CREATED",

        message:
          "Application created",
      },
    });

    return application;
  }

  async findAll(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(userId: string, applicationId: string) {
    const application =
      await this.prisma.application.findFirst({
        where: {
          id: applicationId,
          userId,
        },

        include: {
          activities: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!application) {
      throw new NotFoundException(
        "Application not found",
      );
    }

    return application;
  }

  async update(
    userId: string,
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    await this.findOne(
      userId,
      applicationId,
    );

    const updatedApplication =
      await this.prisma.application.update({
        where: {
          id: applicationId,
        },

        data: updateApplicationDto,
      });

    if (
      updateApplicationDto.status
    ) {
      await this.prisma.applicationActivity.create({
        data: {
          applicationId,

          type: "STATUS_CHANGED",

          message: `Status changed to ${updateApplicationDto.status}`,
        },
      });
    }

    if (
      updateApplicationDto.notes !==
      undefined
    ) {
      await this.prisma.applicationActivity.create({
        data: {
          applicationId,

          type: "NOTES_UPDATED",

          message:
            "Notes updated",
        },
      });
    }

    return updatedApplication;
  }

  async remove(
    userId: string,
    applicationId: string,
  ) {
    await this.findOne(userId, applicationId);

    return this.prisma.application.delete({
      where: {
        id: applicationId,
      },
    });
  }
}