import {Component, Input, OnInit} from '@angular/core';
import {Album} from "./album";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  @Input()
  public albumData!: Album;

  constructor() { }

  ngOnInit(): void {
  }

}
