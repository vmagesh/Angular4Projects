import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  providers: [NgbCarouselConfig]
})
export class HeaderComponent implements OnInit {

  constructor(config: NgbCarouselConfig) { 
      config.interval = 5000;
      config.wrap = true;
  }

  ngOnInit() {
  }

}
