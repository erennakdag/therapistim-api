import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TherapistService } from './therapist.service';

@Module({
  providers: [PrismaService, TherapistService],
  controllers: [],
})
export class TherapistModule {}
