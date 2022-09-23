import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsComponent} from "./artists/artists.component";
import {ContentComponent} from './content/content.component';
import {ContentRoutingModule} from "./content-routing.module";
import {ArtistComponent} from './artists/artist/artist.component';
import {AlbumsComponent} from './albums/albums.component';
import {AlbumComponent} from './albums/album/album.component';
import { TracksComponent } from './tracks/tracks.component';
import { TrackComponent } from './tracks/track/track.component';


@NgModule({
  declarations: [
    ArtistsComponent,
    ContentComponent,
    ArtistComponent,
    AlbumsComponent,
    AlbumComponent,
    TracksComponent,
    TrackComponent,
  ],
  imports: [
    CommonModule,
    ContentRoutingModule
  ]
})
export class ContentModule {
}
