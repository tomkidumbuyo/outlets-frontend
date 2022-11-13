import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { HeaderService } from '../_services/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user: any;

  constructor(
    private auth: AuthenticationService,
    private headerService: HeaderService,
    private router: Router
  ) {

    this.headerService.setPage('user');
    this.auth.isLoggedIn()
    .then((data: any) => {
      this.user = data;
      console.log(this.user)
      if(this.user.type == "temp") {
        router.navigate(['/no-access']);
      } else if(this.user.type == "client") {
        router.navigate(['/project']);
      }
    })
    .catch(err => {
      this.router.navigate(['/auth']);
      console.log('Error getting user.');
    });
    
  }

  ngOnInit(): void  {
    
  }

}
