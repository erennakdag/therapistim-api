import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, Patient as PatientModel } from '@prisma/client';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getPatients(): Promise<PatientModel[]> {
    return await this.patientService.getPatients();
  }

  @Post('new')
  async createPatient(
    @Body() data: Prisma.PatientCreateInput,
  ): Promise<PatientModel> {
    return await this.patientService.createPatient(data);
  }
}
