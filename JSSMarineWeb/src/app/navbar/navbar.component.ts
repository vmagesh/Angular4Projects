import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component( {
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass']
} )
export class NavbarComponent implements OnInit {

    constructor( private shareService: SharedService ) { }

    ngOnInit() {
    }
    
    get val() {
        return this.shareService.getCurrentPageValue();
    }

}
