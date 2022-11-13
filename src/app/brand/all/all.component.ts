import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/_services/brand.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {

  brands = [];
  brandObservarable: any;

  constructor(
    private brandService: BrandService
  ) { 
    this.brandObservarable = this.brandService.getDataObservable();
    this.brandObservarable.subscribe(arg => {
      this.brands = arg.brands;
    });
    brandService.fetch();
  }

  ngOnInit(): void {
  }

}
