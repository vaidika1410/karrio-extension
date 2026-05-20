import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) { }

  async create(
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        userId,
      },
    });
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
    await this.findOne(userId, applicationId);

    return this.prisma.application.update({
      where: {
        id: applicationId,
      },

      data: updateApplicationDto,
    });
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