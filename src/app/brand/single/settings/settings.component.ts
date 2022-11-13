import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { BrandService } from 'src/app/_services/brand.service';
import { ClientService } from 'src/app/_services/client.service';
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  brandObservarable: any;
  brand: any = {_id : 0};

  phones: FormArray;

  newBrandForm: FormGroup;
  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Tanzania, CountryISO.Kenya];

  constructor(
    private brandService: BrandService,
    private clientService: ClientService,
  ) { 


    this.newBrandForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      manager: new FormControl(''),
      email: new FormControl('', [Validators.required]),
      phones: new FormArray([new FormControl('', [Validators.required])])
    });

    this.brandObservarable = this.brandService.getDataObservable();
    this.brandObservarable.subscribe(arg => {
        
        this.brand = arg.brand;
        if(this.brand != undefined && this.brand.manager != undefined) {
          this.newBrandForm.controls['name'].setValue(this.brand.name);
          this.newBrandForm.controls['manager'].setValue(this.brand.manager.name);
          this.newBrandForm.controls['email'].setValue(this.brand.manager.email);
        }
        
    });
    brandService.setPage('setting');

    
    this.phones = this.newBrandForm.get('phones') as FormArray;
    
  }

  ngOnInit(): void {
  }

  updateBrand() {
    const data = {
      _id: this.brand._id,
      name: this.newBrandForm.value.name,
      manager: {
        name: this.newBrandForm.value.manager,
        email: this.newBrandForm.value.email,
        phones: this.newBrandForm.value.phones,
      }
    };
    this.clientService.updateBrand(data);
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
