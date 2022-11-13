import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';

declare var $: any;
declare var CanvasJS: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  projectDataObserver: any;
  dataLoaded: boolean = false;
  project: any = {}

  time = new Date();
  loadingMessage: any = '';

  constructor(
    private projectService: ProjectService,
    private auth: AuthenticationService,
    private router: Router,
    private restApi: RestApiService
  ) {

    this.projectDataObserver = this.projectService.getDataObservable();
    this.projectDataObserver.subscribe((data: any) => {
      this.loadingMessage = data.loadingMessage;
      this.dataLoaded     = data.dataLoaded;
      this.project = data.project;
    });
    this.projectService.setPage('info');

  }

  ngOnInit() {
    
  }

 

}
