import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsComponent} from "./artists/artists.component";
import {ContentRoutingModule} from "./content-routing.module";
import {ArtistComponent} from './artists/artist/artist.component';
import {AlbumsComponent} from './albums/albums.component';
import {AlbumComponent} from './albums/album/album.component';
import {TracksComponent} from './tracks/tracks.component';
import {TrackComponent} from './tracks/track/track.component';
import {GraphQLModule} from "./graphql.module";
import {HeaderComponent} from './header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {SearchBarComponent} from './search-bar/search-bar.component';
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    ArtistsComponent,
    ArtistComponent,
    AlbumsComponent,
    AlbumComponent,
    TracksComponent,
    TrackComponent,
    HeaderComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    GraphQLModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class ContentModule {
}
