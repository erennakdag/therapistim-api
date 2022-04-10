import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { Prisma, Patient as PatientModel } from '@prisma/client';
import { PatientService } from './patient.service';

import { SHA256, enc } from 'crypto-js';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getPatients(): Promise<PatientModel[]> {
    return await this.patientService.getPatients();
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string): Promise<PatientModel> {
    return await this.patientService.getPatientById(id);
  }

  @Post('/validate')
  async validatePatientByEmail(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<PatientModel | HttpStatus> {
    const patient = await this.patientService.getPatientByEmail(email);
    if (patient === null) {
      return HttpStatus.NOT_FOUND;
    }
    if (patient.password === SHA256(password).toString(enc.Hex)) {
      return patient;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }
  }

  @Post('/new')
  async createPatient(
    @Body() data: Prisma.PatientCreateInput,
  ): Promise<PatientModel> {
    // hashing the password
    const hashedPassword = SHA256(data.password).toString(enc.Hex);
    data.password = hashedPassword;

    return await this.patientService.createPatient(data);
  }

  @Post('/update')
  async updatePatient(
    @Body()
    body: {
      where: Prisma.PatientWhereUniqueInput;
      data: Prisma.PatientUpdateInput;
    },
  ): Promise<PatientModel> {
    return await this.patientService.updatePatient(body);
  }
}
