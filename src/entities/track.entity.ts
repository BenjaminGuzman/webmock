import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { AlbumEntity } from "./album.entity";

@Entity()
export class TrackEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar")
  title: string;

  @Column("varchar")
  link: string;

  @Column("varchar")
  preview: string;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks)
  album: AlbumEntity;
}
