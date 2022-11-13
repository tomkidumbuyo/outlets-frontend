import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class RestApiService {

  // Define API
  apiURL = './api/';
a
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  // Http Options
  authHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  constructor(
    private http: HttpClient,
  ) {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (authData && authData !== 'null') {
      this.authHttpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + authData.accessToken
        })
      };
    }
  }

  // HttpClient API get() method
  get(url: string) {
    return new Promise(async (resolve, reject) => {
      this.http.get<any>(this.apiURL + url, this.httpOptions)
      .pipe(
        retry(1),
      ).subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  getAuth(url: string) {
    return new Promise(async (resolve, reject) => {
      this.http.get<any>(this.apiURL + url, this.authHttpOptions)
      .pipe(
        retry(1),
      )
      .subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  // HttpClient API post() method
  post(url: string, data: any) {

    return new Promise(async (resolve, reject) => {
      this.http.post<any>(this.apiURL + url, $.param(data), this.httpOptions)
      .pipe(
        retry(1),
      ).subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  postAuth(url: string, data: any) {

    return new Promise(async (resolve, reject) => {
      this.http.post<any>(this.apiURL + url, $.param(data), this.authHttpOptions)
      .pipe(
        retry(1),
      )
      .subscribe(
      res => {
        resolve(res);
        // console.log("res : ",res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  // HttpClient API put() method
  put(url: string, data: any) {
    return new Promise(async (resolve, reject) => {
      this.http.put<any>(this.apiURL + url, $.param(data), this.httpOptions)
      .pipe(
        retry(1),
      ).subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  putAuth(url: string, data: any) {
    return new Promise(async (resolve, reject) => {
      this.http.put<any>(this.apiURL + url, $.param(data), this.authHttpOptions)
      .pipe(
        retry(1),
      )
      .subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  // HttpClient API delete() method
  delete(url: string) {
    return new Promise(async (resolve, reject) => {
      this.http.delete<any>(this.apiURL + url, this.httpOptions)
      .pipe(
        retry(1)
      )
      .subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  deleteAuth(url: string) {
    return new Promise(async (resolve, reject) => {
      this.http.delete<any>(this.apiURL + url, this.authHttpOptions)
      .pipe(
        retry(1)
      )
      .subscribe(
      res => {
        resolve(res);
      },
      err => {
        this.handleError(err, reject);
      });
    });
  }

  // Error handling
  handleError(error, reject) {
    console.log(error);
    reject(error);
    //  let errorMessage = '';
    //  if (error.error instanceof ErrorEvent) {
    //    // Get client-side error
    //    errorMessage = error.error.message;
    //  } else {
    //    // Get server-side error
    //    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //  }
    //  window.alert(error.error.message);
    //  return throwError(errorMessage);
  }

}
