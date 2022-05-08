import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TherapistService } from './therapist.service';
import { TherapistController } from './therapist.controller';

@Module({
  providers: [PrismaService, TherapistService],
  controllers: [TherapistController],
})
export class TherapistModule {}
