import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RestApiService } from "src/app/_services/rest-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  registerForm;
  loginForm;
  adminExist = true;

  constructor(
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private restApi: RestApiService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });

    this.registerForm = this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      retype_password: new FormControl("", Validators.required),
    });

    this.restApi
      .get("assets/adminExists")
      .then((data: any) => {
        this.adminExist = data.status as boolean;
      })
      .catch((err) => {
        this.adminExist = false;
      });
  }

  ngOnInit(): void {
    this.auth
      .isLoggedIn()
      .then((data) => {
        this.router.navigate(["/"]);
      })
      .catch((err) => {
        console.log("rejected", err);
      });
  }

  login() {
    if (!this.loginForm.value.email || this.loginForm.value.email == "") {
      this.snackBar.open("Please do not leave the email field blank", "Close", {
        verticalPosition: "top",
      });
    } else if (
      !this.loginForm.value.password ||
      this.loginForm.value.password == ""
    ) {
      this.snackBar.open(
        "Please do not leave the password field blank",
        "Close",
        {
          verticalPosition: "top",
        }
      );
    } else {
      this.auth
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then(
          (data: any) => {
            this.router.navigate(["/"]);
          },
          (err) => {
            console.log(err);
            this.snackBar.open(err.error.message, "Close", {
              verticalPosition: "top",
            });
          }
        );
    }
  }

  register() {
    this.auth
      .registerAndLogin(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.retype_password,
        {
          admin: true,
          type: "admin",
          firstName: "main",
          lastName: "admin",
        }
      )
      .then(
        (data: any) => {
          this.router.navigate(["/admin"]);
        },
        (err) => {
          let snackBarRef = this.snackBar.open(err.error.message, "Close", {
            verticalPosition: "top",
          });
        }
      );
  }
}
