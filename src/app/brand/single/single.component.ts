import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/_services/brand.service';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {
  brandObservarable: any;
  page = 'info';
  id: string;
  brand: any;

  constructor(
    private brandService: BrandService,
    private restApiService: RestApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.brandObservarable = this.brandService.getDataObservable();
    this.brandObservarable.subscribe(arg => {
      console.log('args', arg);
      this.page = arg.page;
    });
    this.page = this.brandService.getPage();
  }

  ngOnInit(): void {
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.brand = {_id: this.id, name: 'loading...'}
    this.brandService.selectBrand(this.brand);
    console.log('ID', this.id);
    this.restApiService.getAuth('brand/' + this.id)
    .then((brand: any[]) => {
      console.log('brand', brand)
      this.brand = brand;
      this.brandService.selectBrand(brand);
    })
    .catch(error => {

    });
  }



}
