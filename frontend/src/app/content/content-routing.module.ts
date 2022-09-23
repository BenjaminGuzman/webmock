import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArtistsComponent} from "./artists/artists.component";

const routes: Routes = [
  {path: "artists", component: ArtistsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
