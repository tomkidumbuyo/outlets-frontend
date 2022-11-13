import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { HeaderService } from '../_services/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-not-allowed',
  templateUrl: './user-not-allowed.component.html',
  styleUrls: ['./user-not-allowed.component.scss']
})
export class UserNotAllowedComponent implements OnInit {

  constructor(
    private auth: AuthenticationService,
    private headerService: HeaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }

}
