import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: any;
  private _loggedInUser: any;
  private _locations: any = [];
  private _profilePic: any = '';
  constructor() {
    this._user = this.newUser();
  }

  public get User() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return this._user;
    }
    this._user = user;
    return user;
  }

  public set User(value) {
    this._user = value;
    localStorage.setItem('user', JSON.stringify(this.User));
  }

  public get Code() {
    return this._getIItem('code');
  }

  public set Code(value) {
    this._setItem('code', value);
  }

  public get PhoneNumber() {
    return this._getIItem('phno');
  }

  public set PhoneNumber(value) {
    this._setItem('phno', value);
  }

  public get Email() {
    return this._getIItem('email');
  }

  public set Email(value) {
    this._setItem('email', value);
  }

  public get LoginMethod() {
    return Number(this._getIItem('login_method'));
  }

  public set LoginMethod(value) {
    this._setItem('login_method', value);
  }

  public get UserId() {
    return this._getIItem('user_id');
  }

  public set UserId(value) {
    this._setItem('user_id', value);
  }

  public get AppKey() {
    return this._getIItem('app_key');
  }

  public set AppKey(value) {
    this._setItem('app_key', value);
  }

  public get JWTToken() {
    return this._getIItem('jwt-token');
  }

  public removeItem(item: any) {
    localStorage.removeItem(item);
  }

  private _getIItem(itemName: any) {
    return localStorage.getItem(itemName);
  }

  private _setItem(itemName: any, value: any) {
    localStorage.setItem(itemName, value);
  }

  private newUser() {
    return {
      code: '',
      phno: '',
      user_id: '',
      firstName: '',
      lastName: '',
      login_id: '',
      email_id: '',
      picture: '',
      pin: '',
      login_method: '',
      isNewUser: false,
      user_exist: false
    };
  }

  public get LoggedInUser() {
    let user = JSON.parse(localStorage.getItem('logedInUser'));
    if (!user) {
      return this._loggedInUser;
    }
    user['contactNumber'] = '+' + this.Code + ' ' + this.PhoneNumber;
    user['email'] = this.Email;
    user['profilePic'] = this.UserProfilePic;
    user['phoneNumber'] = this.Code.toString() + this.PhoneNumber.toString();
    return user;
    this._loggedInUser = user;
    return user;
  }

  public set LoggedInUser(value) {
    this._loggedInUser = value;
    localStorage.setItem('logedInUser', JSON.stringify(value));
  }

  public get UserLocations() {
    return this._locations;
  }

  public set UserLocations(value) {
    this._locations = value;
  }

  public set UserProfilePic(value) {
    this._profilePic = value;
  }

  public get UserProfilePic() {
    return this._profilePic;
  }
}
