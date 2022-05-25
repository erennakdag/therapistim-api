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
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { Prisma, Therapist as TherapistModal } from '@prisma/client';
import { enc, SHA256 } from 'crypto-js';
import CustomTherapistCreateInput from 'types/CustomTherapistCreateInput';
import SearchQuery from 'types/SearchQuery';
import Location from 'types/Location';

@Controller('therapists')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  @Get()
  async getTherapists(): Promise<TherapistModal[]> {
    return await this.therapistService.getTherapists();
  }

  @Post()
  async createTherapist(
    @Body()
    data: CustomTherapistCreateInput,
  ): Promise<TherapistModal> {
    // hash the password
    data.password = SHA256(data.password).toString(enc.Hex);

    // adress -> lat and long
    let location: Location;
    try {
      location = await this.therapistService.calcLatLongFromAdress(data.adress);
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

  @Get(':id')
  async getTherapistById(@Param('id') id: string): Promise<TherapistModal> {
    try {
      return await this.therapistService.getTherapistById(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  async deleteTherapistById(@Param('id') id: string): Promise<TherapistModal> {
    try {
      return await this.therapistService.deleteTherapist(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get('search')
  async searchTherapist(
    @Query() query: SearchQuery,
  ): Promise<TherapistModal[]> {
    console.log(query);
    return await this.therapistService.searchTherapists(query);
  }
}
