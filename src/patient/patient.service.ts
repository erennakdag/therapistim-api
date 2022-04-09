import { Injectable } from '@nestjs/common';
import { Prisma, Patient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatients(): Promise<Patient[]> {
    return await this.prisma.patient.findMany();
  }

  async getPatientById(id: string): Promise<Patient> {
    return await this.prisma.patient.findUnique({
      where: {
        id,
      },
    });
  }

  async getPatientByEmail(email: string): Promise<Patient> {
    return await this.prisma.patient.findUnique({
      where: {
        email,
      },
    });
  }

  async createPatient(data: Prisma.PatientCreateInput): Promise<Patient> {
    return await this.prisma.patient.create({
      data,
    });
  }

  async updatePatient({
    where,
    data,
  }: {
    where: Prisma.PatientWhereUniqueInput;
    data: Prisma.PatientUpdateInput;
  }): Promise<Patient> {
    return await this.prisma.patient.update({
      where,
      data,
    });
  }
}
