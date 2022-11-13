import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientService {


  

  clients: any[] = [];
  private dataSource = new Subject();
  page = 'info';
  selectedClient: any;

  constructor(
    private restApiService: RestApiService,
  ) {
    this.fetch();
  }

  fetch() {
    console.log('fetching');
    this.restApiService.getAuth('client')
    .then((clients: any[]) => {
      this.clients = clients;
      this.sendData();
    })
    .catch(error => {

    });
  }

  selectClient(client) {
    this.selectedClient = client;
    this.selectedClient.brands = []
    this.restApiService.getAuth('client/brands/' + client._id)
    .then((brands: any[]) => {
      this.selectedClient.brands = brands;

      for(const brand of this.selectedClient.brands) {
        this.getBrandProducts(brand);
      }
      this.sendData();
    })
    .catch(error => {

    });

    this.selectedClient.projects = [];
    this.restApiService.getAuth('client/projects/' + client._id)
    .then((projects: any[]) => {
      this.selectedClient.projects = projects;
      this.sendData();
    })
    .catch(error => {

    });

    this.restApiService.getAuth('client/' + client._id + '/users')
    .then((users: any[]) => {
      this.selectedClient.users = users;
      this.sendData();
    })
    .catch(error => {

    });

    this.sendData();
  }

  deleteClient(client: any) {
    this.restApiService.deleteAuth('client/' + client._id)
    .then((responce: any[]) => {
      
    })
    .catch(error => {

    });
  }

  getBrandProducts(brand){

    this.restApiService.getAuth('brand/products/' + brand._id)
    .then((products: any[]) => {
      brand.products = products;
      this.sendData();
    })
    .catch(error => {

    });
    
  }

  setPage(page) {
    this.page = page;
    this.sendData();
  }

  getPage() {
    return this.page;
  }


  getDataObservable() {
    return this.dataSource;
  }

  sendData() {
    this.dataSource.next({
      clients: this.clients,
      page: this.page,
      client: this.selectedClient
    });
  }

  // create client
  createClient(data) {
    this.restApiService.postAuth('client/create', data)
    .then(client => {
      this.clients.push(client);
      this.sendData();
    })
    .catch(err => {

    });
  }

  // create client
  updateClient(data) {
    this.restApiService.putAuth('client/' + data._id, data)
    .then((client : any )=> {
      for( let key in this.clients ) {
        if(this.clients[key] == client._id) {
          this.clients[key] = client._id
        }
      }
      this.sendData();
    })
    .catch(err => {

    });
  }

  // upload logos

  createBrand(data) {
    this.restApiService.postAuth('brand/create', data)
    .then(brand => {
      this.selectedClient.brands.push(brand);
      this.sendData();
    })
    .catch(err => {

    });
  }

  updateBrand(data) {
    this.restApiService.putAuth('brand/'+ data._id, data)
    .then(brand => {
      this.selectedClient.brands.push(brand);
      this.sendData();
    })
    .catch(err => {

    });
  }


  createProject(data) {
    this.restApiService.postAuth('project/create', data)
    .then(brand => {
      this.selectedClient.projects.push(brand);
      this.sendData();
    })
    .catch(err => {

    });
  }

}
