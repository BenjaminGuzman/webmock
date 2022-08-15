import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { AlbumEntity } from "./album.entity";

@Entity()
export class ArtistEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  link: string;

  @Column("varchar")
  picture: string;

  @Column("int")
  nAlbums: number;

  @Column("int")
  nFans: number;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[];
}
