import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.sass']
})
export class ServiceDetailsComponent implements OnInit {

  constructor(private shareService:SharedService) { 
      shareService.setCurrentPageValue("servicedetail");
  }

  ngOnInit() {
  }

}
