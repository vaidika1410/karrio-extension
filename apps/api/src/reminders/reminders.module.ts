import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";

import { RemindersService } from "./reminders.service";
import { RemindersController } from "./reminders.controller";

@Module({
  imports: [PrismaModule],

  providers: [RemindersService],

  exports: [RemindersService],

  controllers: [RemindersController],
})
export class RemindersModule {}