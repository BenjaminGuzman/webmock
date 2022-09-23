import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ArtistEntity } from "../artists/artist.entity";
import { TrackEntity } from "../tracks/track.entity";

@Entity()
export class AlbumEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar", { nullable: false })
  title: string;

  @Column("varchar", { nullable: true })
  link: string;

  @Column("varchar", { nullable: true, comment: "URL to deezer's cover image" })
  cover: string;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];
}
