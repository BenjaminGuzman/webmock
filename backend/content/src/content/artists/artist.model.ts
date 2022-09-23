import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Album } from "../albums/album.model";

@ObjectType()
export class Artist {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  link?: string;

  @Field()
  picture?: string;

  @Field(() => Int)
  nAlbums?: number;

  @Field(() => Int)
  nFans?: number;

  @Field(() => [Album])
  albums: Album[];
}
