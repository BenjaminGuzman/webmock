import {Component, Input, OnInit} from '@angular/core';
import {Track} from "./track";

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  @Input()
  public trackData!: Track;

  constructor() { }

  ngOnInit(): void {
  }

}
