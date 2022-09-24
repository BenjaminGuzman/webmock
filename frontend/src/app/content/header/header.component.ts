import {Component, Input, OnInit} from '@angular/core';
import {SessionService} from "../../session.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  public navigation: NavItem[] = [];

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  public logout() {
    this.sessionService.clear();
  }

}

export interface NavItem {
  name: string;
  url?: string;
}
