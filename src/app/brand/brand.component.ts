import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../_services/rest-api.service';
import { HeaderService } from '../_services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../_services/brand.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  id: string;
  brand: any;
  user: any;

  constructor(
    private headerService: HeaderService,
    private brandService: BrandService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.headerService.setPage('brand');
    this.auth.isLoggedIn()
    .then((data: any) => {

      this.user = data;
      if(this.user.type == "temp") {
        router.navigate(['/no-access']);
      } else if(this.user.type == "client") {
        router.navigate(['/project']);
      }

    })
    .catch(err => {
      this.router.navigate(['/auth']);
    });
  }

  ngOnInit(): void {

  }

}
