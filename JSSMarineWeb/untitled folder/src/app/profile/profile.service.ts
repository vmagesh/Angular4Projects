import { Injectable } from '@angular/core';
import { UserService, UploadProfilePic, Profile, CreateLocation, EditLocation } from '../api-middleware';
import { LocationService } from '../api-middleware/api/location.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private userService: UserService, private locationService: LocationService) {}

  uploadFile(data: UploadProfilePic) {
    return this.userService.userProfilePicUploadPost(data);
  }

  updateProfile(data: Profile) {
    return this.userService.userProfilePost(data);
  }

  getLoations() {
    return this.locationService.locationGet();
  }

  addLocation(data: CreateLocation) {
    return this.locationService.locationCreatePost(data);
  }

  editLocation(data: EditLocation) {
    return this.locationService.locationEditPost(data);
  }

  deleteLocation(code: string) {
    return this.locationService.locationCodeDelete(code);
  }
}
