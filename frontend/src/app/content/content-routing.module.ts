import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArtistsComponent} from "./artists/artists.component";
import {AlbumsComponent} from "./albums/albums.component";
import {TracksComponent} from "./tracks/tracks.component";

const routes: Routes = [
  {path: "artists", component: ArtistsComponent},
  {path: "artist/:artistId", component: AlbumsComponent},
  {path: "album/:albumId", component: TracksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
