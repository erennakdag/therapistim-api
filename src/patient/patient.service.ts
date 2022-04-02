import { Injectable } from '@nestjs/common';
import { Prisma, Patient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatients(): Promise<Patient[]> {
    return await this.prisma.patient.findMany();
  }

  async createPatient(data: Prisma.PatientCreateInput): Promise<Patient> {
    return await this.prisma.patient.create({
      data,
    });
  }
}
