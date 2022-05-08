import { Injectable } from '@nestjs/common';
import { Prisma, Therapist } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class TherapistService {
  constructor(private readonly prisma: PrismaService) {}

  async getTherapists(): Promise<Therapist[]> {
    return await this.prisma.therapist.findMany();
  }

  async getTherapistById(id: string): Promise<Therapist> {
    return await this.prisma.therapist.findUnique({ where: { id } });
  }

  async getTherapistByEmail(email: string): Promise<Therapist> {
    return await this.prisma.therapist.findUnique({ where: { email } });
  }

  async getTherapistByFilters(
    where: Prisma.TherapistWhereInput,
  ): Promise<Therapist[]> {
    return await this.prisma.therapist.findMany({ where });
  }

  async createTherapist(data: Prisma.TherapistCreateInput): Promise<Therapist> {
    return await this.prisma.therapist.create({ data });
  }

  async updateTherapist({
    where,
    data,
  }: {
    where: Prisma.TherapistWhereUniqueInput;
    data: Prisma.TherapistUpdateInput;
  }): Promise<Therapist> {
    return await this.prisma.therapist.update({ where, data });
  }

  async calcTherapistLocation(
    adress: string,
  ): Promise<{ latitude: number; longitude: number }> {
    const params = {
      access_key: process.env.POSITIONSTACK_ACCESS_KEY,
      query: adress,
    };
    const resp = await axios.get('http://api.positionstack.com/v1/forward', {
      params,
    });
    const data = resp.data.data[0];
    return { latitude: data.latitude, longitude: data.longitude };
  }

  sanitizeCreateInput(input: string): string[] {
    if (!input.length) return [];

    const values = input.split(',');
    values.forEach((value) => value.trim());
    return values;
  }
}
