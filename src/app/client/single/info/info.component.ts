import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  client: any;
  clientObservarable: any;

  constructor(
    private clientService: ClientService
  ) {
    clientService.setPage('info');
    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      this.client = arg.client;
    });
    clientService.sendData();
 
  }

  ngOnInit(): void {
  }

}
