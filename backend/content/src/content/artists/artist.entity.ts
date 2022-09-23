import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { AlbumEntity } from "../albums/album.entity";

@Entity()
export class ArtistEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("varchar", { nullable: false })
  name: string;

  @Column("varchar", { nullable: true })
  link: string;

  @Column("varchar", { nullable: true })
  picture: string;

  @Column("int", { nullable: true })
  nAlbums: number;

  @Column("int", { nullable: true })
  nFans: number;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[];
}
