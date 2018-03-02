import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class UserProvider {

  logged = false;
  baseUrl = 'http://media.mw.metropolia.fi/wbma/';
  my_id;

  constructor(public http: HttpClient) {
  }

  getUserData(token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
    };
    return this.http.get(this.baseUrl + 'users/user', settings);
  }

  getAllUserInfo(userId) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get(this.baseUrl + 'users/' + userId, settings);
  }

  getMediaOfCurrentUser() {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get(this.baseUrl + 'media/user', settings);
  }

  getMediaOfOtherUser(userId) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get(this.baseUrl + 'media/user/'+ userId, settings);
  }

  checkUsername(username) {
    return this.http.get(this.baseUrl + 'users/username/'+ username);
  }

  editProfile(user) {
     const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.put(this.baseUrl + 'users', user, settings);
  }

  register(user) {
    return this.http.post(this.baseUrl + 'users', user);
  }

  login(user) {
    // optional
    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };
    return this.http.post(this.baseUrl + 'login', user, settings);
  }

  logout() {
    localStorage.removeItem('token');
  }

}
