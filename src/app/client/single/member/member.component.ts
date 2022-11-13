import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ClientService } from 'src/app/_services/client.service';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { UsersService } from 'src/app/_services/users.service';

declare var $: any;

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  client: any;
  clientObservarable: any;

  userObservarable: any;
  users: any;

  newUserForm;
  adminDataObserver: any;

  regions: any[] = [];
  distributionCenters: any[] = [];
  editedUser: any = false;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private restApi: RestApiService,
    public dialog: MatDialog,
    public clientService: ClientService
  ) { 

    clientService.setPage('members');
    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      this.client = arg.client;
      this.users = arg.client.users ? arg.client.users : [];
    });
    clientService.sendData();


    this.newUserForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      retype_password: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      type: new FormControl('admin', Validators.required),
      region: new FormControl('admin', Validators.required),
      dc: new FormControl('admin', Validators.required)
    });

    this.restApi.getAuth('region/')
    .then((data: any) => {
      this.regions = data;
      this.selectRegion();
    });
    
  }

  ngOnInit(): void {

  }

  register() {

    const userAttributes = {
      admin: this.newUserForm.value.admin,
      first_name: this.newUserForm.value.first_name,
      last_name: this.newUserForm.value.last_name,
      type: 'client',
      client: this.client._id,
      phone: this.newUserForm.value.phone,
      dc: null,
      region: null
    };

    if (this.newUserForm.value.type === 'distributionCenter') {
      userAttributes.dc = this.newUserForm.value.dc;
      userAttributes.region = this.newUserForm.value.region;
    } else {
      delete userAttributes.dc;
    }

    if (this.newUserForm.value.type === 'regionalSuperviser') {
      userAttributes.region = this.newUserForm.value.region;
    } else {
      delete userAttributes.region;
    }

    $('#new-user').modal('hide');

    if (this.editedUser) {
      this.auth.editUser(
        this.editedUser,
        userAttributes
      ).then((data: any) => {
        this.users[this.users.indexOf(this.editedUser)] = data;
        this.snackBar.open('User updated successfully', 'Close', {
          verticalPosition: 'top'
        });
        this.clearUser();
      }, (err) => {
        console.log(err.error.message);
        this.snackBar.open('Error creating  user.' + err.error.message, 'Close', {
          verticalPosition: 'top'
        });
      });
    } else {
      this.auth.register(
        this.newUserForm.value.email,
        this.newUserForm.value.password,
        this.newUserForm.value.retype_password,
        userAttributes
      )
      .then((data: any) => {
        this.users.push(data.user.user);
        this.snackBar.open('User added successfully', 'Close', {
          verticalPosition: 'top'
        });
        this.clearUser();
      }, (err) => {
        console.log(err.error.message);
        this.snackBar.open('Error creating  user.' + err.error.message, 'Close', {
          verticalPosition: 'top'
        });
      });
    }
  }

  deleteUser(user) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this user.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restApi.deleteAuth('user/' + user._id)
        .then((data: any) => {
          this.users.splice(this.users.indexOf(user), 1);
        })
        .catch(err => {
          this.snackBar.open(err.error.message, 'Close', {
            verticalPosition: 'top'
          });
        });
      }
    });
  }

  selectRegion() {
    for (const rg of this.regions) {
      if (rg._id === this.newUserForm.value.region) {
        this.distributionCenters = rg.distributionCenters;
        this.newUserForm.get('dc').setValue(rg.distributionCenters[0]._id);
      }
    }
  }

  editUser(user) {

    console.log(user);
    this.editedUser = user;
    this.newUserForm.get('first_name').setValue(user.first_name);
    this.newUserForm.get('last_name').setValue(user.last_name);
    this.newUserForm.get('email').setValue(user.email);
    this.newUserForm.get('phone').setValue(user.phone);
    this.newUserForm.get('type').setValue(user.type);
    if (user.region) {
      this.newUserForm.get('region').setValue(user.region._id);
    }
    if (user.dc) {
      this.newUserForm.get('region').setValue(user.dc.region);
      this.selectRegion();
      this.newUserForm.get('dc').setValue(user.dc.id);
    }
    console.log('edited user', this.editedUser);
  }

  clearUser() {
    this.editedUser = false;
    this.newUserForm.get('first_name').setValue('');
    this.newUserForm.get('last_name').setValue('');
    this.newUserForm.get('email').setValue('');
    this.newUserForm.get('phone').setValue('');
    this.newUserForm.get('type').setValue('admin');
    this.newUserForm.get('region').setValue('');
    this.newUserForm.get('dc').setValue('');
  }

  changePassword() {
    this.auth.changePassword(this.editedUser, this.newUserForm.value.password, this.newUserForm.value.retype_password)
    .then(data => {
      console.log(data);
      $('#change-password').modal('hide');
    })
    .catch(err => {
      this.snackBar.open('Error changing the password.', 'Close', {
        verticalPosition: 'top'
      });
    });

  }

}
