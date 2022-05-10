import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { Prisma, Therapist as TherapistModal } from '@prisma/client';
import { enc, SHA256 } from 'crypto-js';

@Controller('therapist')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  @Get()
  async getTherapists(): Promise<TherapistModal[]> {
    return await this.therapistService.getTherapists();
  }

  @Post()
  async createTherapist(
    @Body()
    data: {
      id?: string;
      name: string;
      email: string;
      password: string;
      phone: string;
      bio: string;
      adress: string;
      institutionName?: string;
      languages: string;
      specialties: string;
      canWriteMedication: boolean;
      website?: string;
      acceptsPrivateInsurance?: boolean;
    },
  ): Promise<TherapistModal> {
    // hash the password
    data.password = SHA256(data.password).toString(enc.Hex);

    // adress -> lat and long
    let location: { latitude: any; longitude: any };
    try {
      location = await this.therapistService.calcTherapistLocation(data.adress);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    // separate languages and specialties from the rest for sanitization
    const { languages, specialties, ...endData } = data;

    try {
      return await this.therapistService.createTherapist({
        ...endData,
        latitude: location.latitude,
        longitude: location.longitude,
        languages: this.therapistService.sanitizeCreateInput(languages),
        specialties: this.therapistService.sanitizeCreateInput(specialties),
      });
    } catch (e) {
      throw new ConflictException();
    }
  }

  @Patch()
  async updateForgottenPassword(
    @Body() data: { email: string; password: string },
  ): Promise<TherapistModal> {
    const { email } = data;

    // hashing the new password
    const password = SHA256(data.password).toString(enc.Hex);

    try {
      return this.therapistService.updateTherapist({
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

  @Put('validate')
  async validateTherapist(
    @Body()
    { email, password }: { email: string; password: string },
  ): Promise<TherapistModal> {
    const therapist = await this.therapistService.getTherapistByEmail(email);
    if (therapist === null) {
      throw new NotFoundException();
    }
    if (therapist.password === SHA256(password).toString(enc.Hex)) {
      return therapist;
    } else {
      throw new UnauthorizedException();
    }
  }
}
