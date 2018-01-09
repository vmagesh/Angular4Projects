import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private shareService:SharedService) { 
      shareService.setCurrentPageValue("home");
      console.log(shareService.getCurrentPageValue());
  }

  ngOnInit() {
  }

}
