import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  client: any = {name : "..."};
  clientObservarable: any;

  deleteVerification: string = '';

  editClientForm: any = new FormGroup({
    name: new FormControl('', [Validators.required]),
    classification: new FormControl('FMCG'),
    website: new FormControl(''),
    adress: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phones: new FormArray([new FormControl('', [Validators.required])])
  });

  formBuilder: any;
  phones: any;
  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Tanzania, CountryISO.Kenya];

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) { 

    clientService.setPage('settings');
    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      console.log('INFO args', arg);
      

      if(arg.client != undefined && this.client.classification == null) {
        this.client = arg.client;
        this.editClientForm.controls['name'].setValue(this.client.name);
        this.editClientForm.controls['classification'].setValue(this.client.classification);
        this.editClientForm.controls['website'].setValue(this.client.website);
        this.editClientForm.controls['adress'].setValue(this.client.adress);
        // this.removeItem(0)
        for(let phone of this.client.phones){
          console.log("phone : ", phone.number)
          this.addItem(phone.number)
        }
      }

    });
    clientService.sendData();

    this.phones = this.editClientForm.get('phones') as FormArray;

  }

  ngOnInit(): void {
  }

  addItem(phone = ""): void {
    console.log('phone');
    this.phones.push(new FormControl(phone, [Validators.required]));
  }

  removeItem(index): void {
    console.log('remove phone');
    this.phones.removeAt(index);
    if (this.phones.value.length == 0) {
      this.addItem();
    }
  }

  deleteClient() {
    if(this.deleteVerification != this.client.name) {
      this.clientService.deleteClient(this.client)
    }
  }

  saveClient() {

    const errors = [];
    console.log(this.editClientForm.value);
    if (!this.editClientForm.value.name) {
      errors.push('Name is required');
    }
    if (!this.editClientForm.value.classification) {
      errors.push('Classification is required');
    }
    if (!this.editClientForm.value.email) {
      errors.push('Email is required');
    }
    if (!this.editClientForm.value.adress) {
      errors.push('Adress is required');
    }

    for ( const phone of this.editClientForm.value.phones) {
      console.log(phone);
      if (!phone) {
        errors.push('Please fill all the phone numbers');
      }
    }


    if (errors.length) {
      let mesage = errors[0];
      if (errors.length > 1) {
        mesage += ' and ' + (errors.length - 1) + ' more error(s)';
      } 
      this.snackBar.open(mesage, 'ok', {
        duration: 2000,
      });
    } else {
      this.clientService.updateClient(this.editClientForm.value);
    }

  }

}
