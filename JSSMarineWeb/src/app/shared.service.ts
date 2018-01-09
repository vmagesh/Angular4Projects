import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    private currentPageValue : string;
    
    constructor() { }

    setCurrentPageValue( val ) {
        this.currentPageValue = val;
    }

    getCurrentPageValue() {
        return this.currentPageValue;
    }
}
