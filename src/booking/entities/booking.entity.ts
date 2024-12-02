import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Booking {
  @Field(() => ID)
  id: number;

  @Field()
  user: string;

  @Field()
  date: Date;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
