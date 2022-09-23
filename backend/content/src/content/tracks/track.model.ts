import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Track {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  link?: string;

  @Field()
  preview?: string;

  @Field(() => Int)
  price: number;
}
