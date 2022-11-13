import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RestApiService } from "./rest-api.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  user: any = false;
  accessToken = false;

  constructor(public restApi: RestApiService, public router: Router) {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData) {
      this.user = authData.user;
      this.accessToken = authData.accessToken;
    }
  }

  isLoggedIn() {
    return new Promise(async (resolve, reject) => {
      if (this.accessToken && this.user) {
        this.restApi
          .postAuth("auth/isLoggedIn", {
            accessToken: this.accessToken,
            user: this.user,
          })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(false);
          });
      } else {
        reject(false);
      }
    });
  }

  register(
    email: string,
    password: string,
    verifyPassword: string,
    userAttributes: any = {}
  ) {
    return new Promise(async (resolve, reject) => {
      this.restApi
        .post("auth/register", {
          password,
          email,
          verifyPassword: verifyPassword,
          userAttributes,
        })
        .then((data: any) => {
          resolve({ user: data });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  registerAndLogin(
    email: string,
    password: string,
    verifyPassword: string,
    userAttributes: any = {}
  ) {
    return new Promise(async (resolve, reject) => {
      this.restApi
        .post("auth/register", {
          password,
          email,
          verifyPassword: verifyPassword,
          userAttributes,
        })
        .then((data: any) => {
          this.user = data.user;
          this.accessToken = data.accessToken;
          localStorage.setItem(
            "authData",
            JSON.stringify({ user: this.user, accessToken: this.accessToken })
          );
          resolve({ user: this.user, accessToken: this.accessToken });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.restApi
        .post("auth/login", {
          email,
          password,
        })
        .then((data: any) => {
          this.user = data.user;
          this.accessToken = data.accessToken;
          localStorage.setItem(
            "authData",
            JSON.stringify({ user: this.user, accessToken: this.accessToken })
          );
          resolve({ user: this.user, accessToken: this.accessToken });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  logout() {
    // remove user data from local storage for log out
    localStorage.removeItem("authData");
    this.user = false;
    this.accessToken = false;
  }

  editUser(user, attributes) {
    return new Promise((resolve, reject) => {
      this.restApi
        .putAuth("auth/user/" + user._id, attributes)
        .then((data) => {
          this.user = data;
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  changePassword(user, pass: string, passVerification: string) {
    return new Promise((resolve, reject) => {
      if (pass === passVerification) {
        const postData = { password: pass };
        this.restApi
          .putAuth("auth/changePassword/" + user._id, postData)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject("passwords don't match");
      }
    });
  }

  changeMyPassword() {}

  getUser() {
    return this.user;
  }
}
