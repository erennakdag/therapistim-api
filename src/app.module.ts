import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patient/patient.module';

@Module({
  imports: [PatientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
