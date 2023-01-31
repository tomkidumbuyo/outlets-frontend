import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/_services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: any = {};
  headerDataObserver: any;
  page: string;

  constructor(
    private auth: AuthenticationService,
    private headerService: HeaderService,
    private router: Router
  ) {
    this.page = headerService.getPage();

    this.headerDataObserver = this.headerService.getDataObservable();
    this.headerDataObserver.subscribe((data: any) => {
        this.page = data.page;
      }
    );
  }

  ngOnInit(): void {
    this.auth.isLoggedIn()
    .then((data: any) => {
      this.user = data;
    })
    .catch(err => {
      console.log('Error getting user.');
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }

}
