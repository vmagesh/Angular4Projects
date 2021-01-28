import { Component, OnInit } from '@angular/core';
import { AddUserComponent } from './components/add-user/add-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  openModal(type: any, location: any) {
    const modalRef = this.modalService.open(AddUserComponent);
    console.log(type);
    if (type === 'add') {
      modalRef.componentInstance.location = {
        type: type
      };
    } else {
      console.log(type);
      modalRef.componentInstance.location = {
        type: type,
        locationname: location.name.split(':::')[0],
        country: location.name.split(':::')[1],
        state: location.name.split(':::')[3],
        city: location.name.split(':::')[5]
      };
    }
    modalRef.result.then(result => {
      if (result) {
        let request = result.locationname + ':::' + result.country + ':::' + result.state + ':::' + result.city;
        if (type === 'add') {
          //this.addLocation(request);
        } else {
          //this.editLocation(request, location['id']);
        }
      }
    });
  }
}
