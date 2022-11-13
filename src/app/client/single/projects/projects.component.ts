import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  clientObservarable: any;
  client: any;

  constructor(
    private clientService: ClientService
  ) {
      clientService.setPage('projects');
      this.clientObservarable = this.clientService.getDataObservable();
      this.clientObservarable.subscribe(arg => {
        console.log('args', arg);
        this.client = arg.client;
      });
      clientService.sendData();
  }

  ngOnInit(): void {
    
  }

}
