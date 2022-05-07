import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
    data: Prisma.TherapistCreateInput,
  ): Promise<TherapistModal> {
    // hash the password
    data.password = SHA256(data.password).toString(enc.Hex);

    // adress -> lat and long
    const location = await this.therapistService.getTherapistLocation(
      data.adress,
    );
    data.latitude = location.latitude;
    data.longitude = location.longtitude;

    return await this.therapistService.createTherapist(data);
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
