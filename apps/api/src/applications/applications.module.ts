import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { RemindersModule } from "../reminders/reminders.module";

@Module({
  imports: [
    RemindersModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService]
})
export class ApplicationsModule { }
