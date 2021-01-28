import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  private _countryJsonURL = 'assets/Contries.json';
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  @ViewChild('country', { static: false }) country: HTMLSelectElement;
  @ViewChild('state', { static: false }) state: any;
  @ViewChild('city', { static: false }) city: any;
  @Input() public location: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  error: any = '';

  constructor(private http: Http, public activeModal: NgbActiveModal) {
    this.getJSON().subscribe(
      (data2: any) => {
        this.countryInfo = data2.Countries;
        if (this.location.type === 'edit') {
          this.location.country = this.location.country;
          this.stateInfo = this.countryInfo[this.location.country].States;
          this.location.state = this.location.state;
          this.cityInfo = this.stateInfo[this.location.state].Cities;
          this.location.city = this.location.city;
        } else {
          this.location.locationname = '';
          this.location.country = 0;
          this.stateInfo = this.countryInfo[0].States;
          this.location.state = 0;
          this.cityInfo = this.stateInfo[0].Cities;
          this.location.city = 0;
        }
      },
      (err: any) => console.log(err),
      () => console.log('complete')
    );
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._countryJsonURL).map((response: any) => response.json());
  }

  ngOnInit() {}

  onChangeCountry(countryValue: any) {
    this.location.country = countryValue;
    this.stateInfo = this.countryInfo[countryValue].States;
    this.location.state = 0;
    this.cityInfo = this.stateInfo[0].Cities;
    this.location.city = 0;
  }

  onChangeState(stateValue: any) {
    this.cityInfo = this.stateInfo[stateValue].Cities;
  }

  saveLocation() {
    if (this.location.locationname != '') {
      this.location.country =
        this.location.country + ':::' + this.country['nativeElement'][this.country['nativeElement'].value].label;
      this.location.state =
        this.location.state + ':::' + this.state['nativeElement'][this.state['nativeElement'].value].label;
      this.location.city =
        this.location.city + ':::' + this.city['nativeElement'][this.city['nativeElement'].value].label;
      this.passEntry.emit(this.location);
      this.activeModal.close(this.location);
    } else {
      this.error = 'Location name cannot be empty';
    }
  }
}
