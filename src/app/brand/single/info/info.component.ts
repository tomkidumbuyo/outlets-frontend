import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_services/client.service';
import { BrandService } from 'src/app/_services/brand.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  brandObservarable: any;
  brand: any;

  constructor(
    private brandService: BrandService
  ) {
    
    this.brandObservarable = this.brandService.getDataObservable();
    this.brandObservarable.subscribe(arg => {
      console.log('args', arg);
      this.brand = arg.brand;
    });
    brandService.setPage('info');
  }

  ngOnInit(): void {
  }

}
