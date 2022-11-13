import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {

  projectObservarable: any;
  page = 'dashboard';
  id: string;
  project: any;

  constructor(
    private projectService: ProjectService,
    private restApiService: RestApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.projectObservarable = this.projectService.getDataObservable();
    this.projectObservarable.subscribe(arg => {
      this.page = arg.page;
      this.project = arg.project;
    });
    this.page = this.projectService.getPage();
  }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.project = {_id : this.id, name: 'loading ...' };
    this.projectService.selectProject(this.project);

  }

}
