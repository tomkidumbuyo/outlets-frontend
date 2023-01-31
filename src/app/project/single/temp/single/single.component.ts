import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "src/app/_services/project.service";
import { TempService } from "src/app/_services/temp.service";

@Component({
  selector: "app-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleComponent implements OnInit {
  project: any;
  projectObservarable: any;

  temp: any;
  user: any = {
    firstName: " loading",
    lastName: "...",
  };
  tempObservarable: any;

  page = "false";
  id: any;
  project_id: any;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private tempService: TempService
  ) {
    this.projectObservarable = this.projectService.getDataObservable();
    this.projectObservarable.subscribe((arg) => {
      this.project = arg.project;
    });

    this.tempObservarable = this.tempService.getDataObservable();
    this.tempObservarable.subscribe((arg) => {
      if (arg.temp != undefined) {
        this.temp = arg.temp;
        this.user = arg.temp.user;
      }
      this.page = arg.page;
    });
    this.page = this.tempService.getPage();
    this.projectService.setPage("temps");
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.tempService.setId(this.id);
  }
}
