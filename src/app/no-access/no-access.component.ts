import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss']
})
export class NoAccessComponent implements OnInit {
  user: any;

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) { 
    this.auth.isLoggedIn()
    .then((data: any) => {

      this.user = data;
      console.log(this.user)
      if(this.user.type != "temp") {
        router.navigate(['/outlet']);
      } else if(this.user.type == "client") {
        router.navigate(['/project']);
      }

    })
    .catch(err => {
      this.router.navigate(['/auth']);
      console.log('Error getting user.');
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }

}
