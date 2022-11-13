import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { HeaderService } from '../_services/header.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  user: any;

  constructor(
    private headerService: HeaderService,
    private auth: AuthenticationService,
    private router: Router
  ) {

    this.headerService.setPage('project');
    this.auth.isLoggedIn()
    .then((data: any) => {
      this.user = data;
      if(this.user.type == "temp") {
        router.navigate(['/no-access']);
      }
    })
    .catch(err => {
      this.router.navigate(['/auth']);
      console.log('Error getting user.');
    });

  }

  ngOnInit(): void {
  }

}
