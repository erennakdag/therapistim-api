import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
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

  @Post()
  async createPatient(
    @Body() data: Prisma.PatientCreateInput,
  ): Promise<PatientModel> {
    // hashing the password
    const hashedPassword = SHA256(data.password).toString(enc.Hex);
    data.password = hashedPassword;

    try {
      return await this.patientService.createPatient(data);
    } catch (error) {
      throw new ConflictException();
    }
  }

  @Patch()
  async updateForgottenPassword(
    @Body() data: { email: string; password: string },
  ): Promise<PatientModel> {
    const { email } = data;

    // hashing the new password
    const password = SHA256(data.password).toString(enc.Hex);

    try {
      return this.patientService.updatePatient({
        where: {
          email,
        },
        data: {
          password,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /* 
    When you call this function from the frontend client
    as an API endpoint you pass in email,
    when called from this class you pass in id.
  */
  @Put('/validate')
  async validatePatient(
    @Body()
    { id, email, password }: { id?: string; email?: string; password: string },
  ): Promise<PatientModel> {
    const patient = email
      ? await this.patientService.getPatientByEmail(email)
      : await this.patientService.getPatientById(id);
    if (patient === null) {
      throw new NotFoundException();
    }
    if (patient.password === SHA256(password).toString(enc.Hex)) {
      return patient;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string): Promise<PatientModel> {
    const patient = await this.patientService.getPatientById(id);
    if (patient === null) {
      throw new NotFoundException();
    }
    return patient;
  }

  @Patch(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body()
    body: {
      passwordOld: string;
      password?: string;
      phone?: string;
    },
  ): Promise<PatientModel> {
    const { passwordOld, ...data } = body;

    // hash the password
    data.password = data.password
      ? SHA256(data.password).toString(enc.Hex)
      : undefined;

    if (await this.validatePatient({ id, password: passwordOld }))
      return await this.patientService.updatePatient({
        where: {
          id,
        },
        data,
      });
  }

  @Delete('/:id')
  async deletePatient(@Param('id') id: string): Promise<PatientModel> {
    try {
      return await this.patientService.deletePatient(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
