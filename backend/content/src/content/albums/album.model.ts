import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Artist } from "../artists/artist.model";
import { Track } from "../tracks/track.model";

@ObjectType()
export class Album {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  link?: string;

  @Field({description: "URL to deezer's cover image"})
  cover?: string;

  @Field(() => Artist)
  artist: Artist;

  @Field(() => [Track])
  tracks: Track[];
}
