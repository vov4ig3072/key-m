import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBookingInput } from './dto/update-booking.input';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  private validateDateTime(
    startTime: string,
    endTime: string,
    date: Date,
  ): boolean {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be earlier than end time');
    }

    if (new Date().getTime() >= date.getTime()) {
      throw new BadRequestException('Booking date cannot be past');
    }

    return true;
  }

  async create(create: CreateBookingInput) {
    const { startTime, endTime, date } = create;
    this.validateDateTime(startTime, endTime, date);

    const conflict = await this.prisma.booking.findFirst({
      where: {
        date: create.date,
        startTime: { lte: create.endTime },
        endTime: { gte: create.startTime },
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'The selected time slot is already booked. Please choose a different time.',
      );
    }

    return this.prisma.booking.create({ data: create });
  }

  async update({ id, ...update }: UpdateBookingInput) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return new NotFoundException('Booking not found, wrong id');
    }

    const { startTime, endTime, date } = update;
    this.validateDateTime(startTime, endTime, date);

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        id: { not: id },
        date: update.date,
        startTime: { lte: update.endTime },
        endTime: { gte: update.startTime },
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException(
        'The selected time slot is already booked. Please choose a different time.',
      );
    }

    return this.prisma.booking.update({
      where: { id: id },
      data: update,
    });
  }

  findAll() {
    return this.prisma.booking.findMany();
  }

  findOne(id: string) {
    return this.prisma.booking
      .findUniqueOrThrow({ where: { id } })
      .catch((e) => new NotFoundException('Booking not found, wrong id'));
  }

  async remove(id: string) {
    try {
      await this.prisma.booking.findUniqueOrThrow({ where: { id } });
      const { id: deletedId } = await this.prisma.booking.delete({
        where: { id },
        select: { id: true },
      });

      return `Deletion success, deleted ID ${deletedId}`;
    } catch (e) {
      return new NotFoundException('Booking not found, wrong id');
    }
  }
}
