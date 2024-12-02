import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateBookingInput } from './create-booking.input';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field(() => ID)
  id: string;
}
