import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { AlbumEntity } from "./album.entity";

@Entity()
export class TrackEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar", { nullable: false })
  title: string;

  @Column("varchar", { nullable: true })
  link: string;

  @Column("varchar", { nullable: true })
  preview: string;

  @Column("numeric", { nullable: false, default: 10 })
  price: string;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks)
  album: AlbumEntity;
}