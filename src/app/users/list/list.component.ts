import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "src/app/_services/users.service";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RestApiService } from "src/app/_services/rest-api.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "src/app/shared/confirmation-dialog/confirmation-dialog.component";

declare var $: any;

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  userObservarable: any;
  users: any;

  newUserForm;
  adminDataObserver: any;

  regions: any[] = [];
  distributionCenters: any[] = [];
  editedUser: any = false;

  constructor(
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private restApi: RestApiService,
    public dialog: MatDialog
  ) {
    this.userObservarable = this.userService.getDataObservable();
    this.userObservarable.subscribe((arg) => {
      this.users = arg.users;
    });
    userService.fetch();

    this.restApi
      .getAuth("admin/users")
      .then((data: any[]) => {
        this.users = data;
      })
      .catch((err) => {
        this.snackBar.open("Error getting users" + err.error.message, "Close", {
          verticalPosition: "top",
        });
      });

    this.newUserForm = this.formBuilder.group({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      retype_password: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      type: new FormControl("admin", Validators.required),
      region: new FormControl("admin", Validators.required),
      dc: new FormControl("admin", Validators.required),
    });

    this.restApi.getAuth("region/").then((data: any) => {
      this.regions = data;
      this.selectRegion();
    });
  }

  ngOnInit(): void {}

  register() {
    const userAttributes = {
      admin: this.newUserForm.value.admin,
      firstName: this.newUserForm.value.firstName,
      lastName: this.newUserForm.value.lastName,
      type: this.newUserForm.value.type,
      phone: this.newUserForm.value.phone,
      dc: null,
      region: null,
    };

    if (this.newUserForm.value.type === "distributionCenter") {
      userAttributes.dc = this.newUserForm.value.dc;
      userAttributes.region = this.newUserForm.value.region;
    } else {
      delete userAttributes.dc;
    }

    if (this.newUserForm.value.type === "regionalSuperviser") {
      userAttributes.region = this.newUserForm.value.region;
    } else {
      delete userAttributes.region;
    }

    $("#new-user").modal("hide");

    if (this.editedUser) {

      this.auth.editUser(this.editedUser, userAttributes).then(
        (data: any) => {
          this.users[this.users.indexOf(this.editedUser)] = data;
          this.snackBar.open("User updated successfully", "Close", {
            verticalPosition: "top",
          });
          this.clearUser();
        },
        (err) => {
          this.snackBar.open(
            "Error creating  user." + err.error.message,
            "Close",
            {
              verticalPosition: "top",
            }
          );
        }
      );
    } else {
      this.auth
        .register(
          this.newUserForm.value.email,
          this.newUserForm.value.password,
          this.newUserForm.value.retype_password,
          userAttributes
        )
        .then(
          (data: any) => {
            this.users.push(data.user.user);
            this.snackBar.open("User added successfully", "Close", {
              verticalPosition: "top",
            });
            this.clearUser();
          },
          (err) => {
            this.snackBar.open(
              "Error creating  user." + err.error.message,
              "Close",
              {
                verticalPosition: "top",
              }
            );
          }
        );
    }
  }

  deleteUser(user) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data: "Do you confirm the deletion of this user.",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restApi
          .deleteAuth("user/" + user._id)
          .then((data: any) => {
            this.users.splice(this.users.indexOf(user), 1);
          })
          .catch((err) => {
            this.snackBar.open(err.error.message, "Close", {
              verticalPosition: "top",
            });
          });
      }
    });
  }

  selectRegion() {
    for (const rg of this.regions) {
      if (rg._id === this.newUserForm.value.region) {
        this.distributionCenters = rg.distributionCenters;
        this.newUserForm.get("dc").setValue(rg.distributionCenters[0]._id);
      }
    }
  }

  editUser(user) {
    this.editedUser = user;
    this.newUserForm.get("firstName").setValue(user.firstName);
    this.newUserForm.get("lastName").setValue(user.lastName);
    this.newUserForm.get("email").setValue(user.email);
    this.newUserForm.get("phone").setValue(user.phone);
    this.newUserForm.get("type").setValue(user.type);
    if (user.region) {
      this.newUserForm.get("region").setValue(user.region._id);
    }
    if (user.dc) {
      this.newUserForm.get("region").setValue(user.dc.region);
      this.selectRegion();
      this.newUserForm.get("dc").setValue(user.dc.id);
    }
  }

  clearUser() {
    this.editedUser = false;
    this.newUserForm.get("firstName").setValue("");
    this.newUserForm.get("lastName").setValue("");
    this.newUserForm.get("email").setValue("");
    this.newUserForm.get("phone").setValue("");
    this.newUserForm.get("type").setValue("admin");
    this.newUserForm.get("region").setValue("");
    this.newUserForm.get("dc").setValue("");
  }

  changePassword() {
    this.auth
      .changePassword(
        this.editedUser,
        this.newUserForm.value.password,
        this.newUserForm.value.retype_password
      )
      .then((data) => {
        $("#change-password").modal("hide");
      })
      .catch((err) => {
        this.snackBar.open("Error changing the password.", "Close", {
          verticalPosition: "top",
        });
      });
  }
}
