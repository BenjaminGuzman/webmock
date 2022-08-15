import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ArtistEntity } from "./artist.entity";
import { TrackEntity } from "./track.entity";

@Entity()
export class AlbumEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar")
  title: string;

  @Column("varchar")
  link: string;

  @Column("varchar")
  cover: string;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];
}
