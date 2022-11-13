import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of, Observable, from } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: any[] = [];
  private dataSource = new Subject();
  selectedUser: any;
  page: any;

  constructor(
    private restApiService: RestApiService,
  ) {
    this.fetch();
  }

  getDataObservable() {
    return this.dataSource;
  }

  fetch() {
    console.log('fetching');
    this.restApiService.getAuth('user/all')
    .then((users: any[]) => {
      this.users = users;
      this.sendData();
    })
    .catch(error => {

    });
  }

  sendData() {
    this.dataSource.next({
      users: this.users,
      page: this.page,
      user: this.selectedUser
    });
  }

  selectPage(page) {
    this.page = page;
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  autoCompleteByEmail(value) {
    return from(this.restApiService.getAuth('user/emailAutocomplete?query=' + value));
  }

}
