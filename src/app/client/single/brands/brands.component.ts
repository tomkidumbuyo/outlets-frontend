import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_services/client.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
declare var $: any;

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  clientObservarable: any;
  client: any;
  phones: FormArray;

  newBrandForm: FormGroup;
  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Tanzania, CountryISO.Kenya];

  constructor(
    private clientService: ClientService
  ) {
    clientService.setPage('brands');
    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      console.log('args', arg);
      this.client = arg.client;
    });
    clientService.sendData();
    this.newBrandForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      client: new FormControl('FMCG'),
      manager: new FormControl(''),
      email: new FormControl('', [Validators.required]),
      phones: new FormArray([new FormControl('', [Validators.required])])
    });
    this.phones = this.newBrandForm.get('phones') as FormArray;
  }

  ngOnInit(): void {
  }

  createBrand() {
    const data = {
      name: this.newBrandForm.value.name,
      client: this.client._id,
      manager: {
        name: this.newBrandForm.value.manager,
        email: this.newBrandForm.value.email,
        phones: this.newBrandForm.value.phones,
      }
    };
    this.clientService.createBrand(data);
    $('#brandmodal').modal('hide');
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

}
