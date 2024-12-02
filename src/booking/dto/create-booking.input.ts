import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

@InputType()
export class CreateBookingInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "User's name is required" })
  user: string;

  @Field(() => Date)
  @IsDate({ message: 'Invalid date format' })
  date: Date;

  @Field()
  @IsString()
  @Matches(regex, {
    message: 'Start time must be in HH:mm format',
  })
  startTime: string;

  @Field()
  @IsString()
  @Matches(regex, {
    message: 'End time must be in HH:mm format',
  })
  endTime: string;
}
