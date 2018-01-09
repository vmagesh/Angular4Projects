import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PageScrollConfig } from 'ng2-page-scroll';

@Component( {
    selector: 'app-root',
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
    template: `
    <div class="container-fill">
        <router-outlet></router-outlet>
    </div>
  `,
    styles: []
} )
export class AppComponent {
    constructor() {
        PageScrollConfig.defaultScrollOffset = 60;
    }
    loading: string = '';
    bodyShow: boolean = false;
}
