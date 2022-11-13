import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private dataSource = new Subject();
  page: string;

  constructor() { }

  getDataObservable() {
    return this.dataSource;
  }

  setPage(page) {
    this.page = page;
    this.sendData();
  }

  getPage() {
    return this.page;
  }

  sendData() {
    console.log('sendData');
    this.dataSource.next({
      page: this.page,
    });
  }


}
