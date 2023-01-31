import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../_services/rest-api.service';
import { HeaderService } from '../_services/header.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  user: any;

  constructor(
    private restApi: RestApiService,
    private headerService: HeaderService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.headerService.setPage('client');
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
