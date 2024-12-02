import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => Booking)
  createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
  ) {
    return this.bookingService.create(createBookingInput);
  }

  @Mutation(() => Booking)
  updateBooking(
    @Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
  ) {
    return this.bookingService.update(updateBookingInput);
  }

  @Query(() => [Booking], { name: 'allBookings' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Query(() => Booking, { name: 'booking' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.bookingService.findOne(id);
  }

  @Mutation(() => String)
  removeBooking(@Args('id', { type: () => ID }) id: string) {
    return this.bookingService.remove(id);
  }
}
