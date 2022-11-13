import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {

  projects: any[] = [];
  projectDataObserver: any;

  constructor(
    private projectService: ProjectService,
    private auth: AuthenticationService,
    private router: Router,
    private restApi: RestApiService
  ) {
    this.projectDataObserver = this.projectService.getDataObservable();
    this.projectDataObserver.subscribe((data: any) => {
      this.projects = data.projects;
    });
    this.projectService.fetch();
  }

  ngOnInit(): void {
  }

}
