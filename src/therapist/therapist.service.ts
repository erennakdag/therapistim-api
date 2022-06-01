import { Injectable } from '@nestjs/common';
import { Prisma, Therapist } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { getDistance } from 'geolib';
import SearchQuery from 'types/SearchQuery';
import Location from 'types/Location';

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

  async searchTherapists(query: SearchQuery): Promise<Therapist[]> {
    const { adress, radius, name, languages, specialties } = query;

    const acceptsPrivateInsurance = Boolean(query.acceptsPrivateInsurance);
    const canWriteMedication = Boolean(query.canWriteMedication);

    // getting the user's location to find the nearest therapists
    const location = await this.calcLatLongFromAdress(adress);

    const therapists = await this.prisma.therapist.findMany();

    return therapists.filter((therapist) => {
      if (name && !therapist.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      if (languages && !therapist.languages.includes(languages)) {
        return false;
      }

      if (specialties && !therapist.specialties.includes(specialties)) {
        return false;
      }

      if (
        acceptsPrivateInsurance &&
        acceptsPrivateInsurance !== therapist.acceptsPrivateInsurance
      )
        return false;

      if (
        canWriteMedication &&
        canWriteMedication !== therapist.canWriteMedication
      )
        return false;

      const distance = getDistance(location, {
        latitude: therapist.latitude,
        longitude: therapist.longitude,
      });
      return distance <= radius;
    });
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

  async deleteTherapist(id: string): Promise<Therapist> {
    return await this.prisma.therapist.delete({ where: { id } });
  }

  async calcLatLongFromAdress(adress: string): Promise<Location> {
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
    // sanitizes the input given by the user and turns the string into an array
    if (!input.length) return [];

    return input.split(',').map((value) => value.trim());
  }
}
