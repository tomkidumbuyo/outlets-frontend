import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from 'src/app/_services/client.service';
declare var $: any;

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {

  formBuilder: any;
  phones: any;
  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Tanzania, CountryISO.Kenya];
  newClientForm: any;

  clients = [];
  clientObservarable: any;

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {

    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      this.clients = arg.clients;
    });
    clientService.fetch();

    this.newClientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      classification: new FormControl('FMCG'),
      website: new FormControl(''),
      adress: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phones: new FormArray([new FormControl('', [Validators.required])])
    });
    this.phones = this.newClientForm.get('phones') as FormArray;
  }



  ngOnInit(): void {


  }


  addItem(): void {
    console.log('phone');
    this.phones.push(new FormControl('', [Validators.required]));
  }

  removeItem(index): void {
    console.log('remove phone');
    this.phones.removeAt(index);
    if (this.phones.value.length == 0) {
      this.addItem();
    }
  }

  createClient() {

    const errors = [];
    console.log(this.newClientForm.value);
    if (!this.newClientForm.value.name) {
      errors.push('Name is required');
    }
    if (!this.newClientForm.value.classification) {
      errors.push('Classification is required');
    }
    if (!this.newClientForm.value.email) {
      errors.push('Email is required');
    }
    if (!this.newClientForm.value.adress) {
      errors.push('Adress is required');
    }

    for ( const phone of this.newClientForm.value.phones) {
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
      this.clientService.createClient(this.newClientForm.value);
      $('#clientmodal').modal('hide');
    }

  }
}
