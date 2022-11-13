import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_services/client.service';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {

  client: any;
  id: string;
  clientObservarable: any;
  page = 'info';


  constructor(
    private clientService: ClientService,
    private restApiService: RestApiService,
    private activatedRoute: ActivatedRoute,
  ) {

    this.clientObservarable = this.clientService.getDataObservable();
    this.clientObservarable.subscribe(arg => {
      this.page = arg.page;
      this.client = arg.client;
    });
    this.page = this.clientService.getPage();

  }

  ngOnInit(): void {

    this.client = {};
    this.client._id = this.activatedRoute.snapshot.paramMap.get('id');
    this.client.name = 'loading ...';

    this.restApiService.getAuth('client/' + this.client._id)
    .then((client: any) => {
      this.client = client;
      this.clientService.selectClient(client);
    })
    .catch(error => {

    });
  }

}
