import { Component, OnInit } from "@angular/core";
import { ProjectService } from "src/app/_services/project.service";
import { TempService } from "src/app/_services/temp.service";

declare var $: any;
declare var CanvasJS: any;

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
})
export class InfoComponent implements OnInit {
  temp: any;
  tempObservarable: any;
  projectObservarable: any;

  page = "false";
  id: any;
  user: any = {
    firstName: "Loading ",
    lastName: "...",
  };
  project: any;
  report: any;

  constructor(
    private tempService: TempService,
    private projectService: ProjectService
  ) {
    this.projectObservarable = this.projectService.getDataObservable();
    this.projectObservarable.subscribe((arg) => {
      this.project = arg.project;
    });

    this.tempObservarable = this.tempService.getDataObservable();
    this.tempObservarable.subscribe((arg) => {
      if (arg.temp) {
        this.temp = arg.temp;
        this.user = arg.temp.user;
        this.report = arg.report;
      }
    });

    this.tempService.setPage("info");
  }

  ngOnInit(): void {}
}
