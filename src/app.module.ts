import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patient/patient.module';
import { TherapistModule } from './therapist/therapist.module';

@Module({
  imports: [PatientsModule, TherapistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
