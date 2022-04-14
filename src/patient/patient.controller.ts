import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
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
    const patient = await this.patientService.getPatientById(id);
    if (patient === null) {
      throw new NotFoundException();
    }
    return patient;
  }

  @Post('/validate')
  async validatePatientByEmail(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<PatientModel> {
    const patient = await this.patientService.getPatientByEmail(email);
    if (patient === null) {
      throw new NotFoundException();
    }
    if (patient.password === SHA256(password).toString(enc.Hex)) {
      return patient;
    } else {
      throw new UnauthorizedException();
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

  @Delete('/delete')
  async deletePatient(@Body() { id }: { id: string }): Promise<PatientModel> {
    try {
      return await this.patientService.deletePatient(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
