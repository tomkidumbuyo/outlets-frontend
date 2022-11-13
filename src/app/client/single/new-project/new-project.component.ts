import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { ClientService } from 'src/app/_services/client.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/_services/project.service';


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  client: any = {};
  clientObservarable: any;

  newProjectForm: FormGroup;

  contactPeopleFormArray: FormArray;
  brands: FormArray;

  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Tanzania, CountryISO.Kenya];

  availableProducts: any[] = [];

  products: any[] = [];
  regions: any[] = [];
  posms: any[] = [];
  giveaways: any[] = [];

  filteredproducts: any = [];
  projectId: any;
  project: any;
  classifications: any[];
  categories: any[];
  dissabled: boolean = true;
  

  constructor(
    private route: ActivatedRoute,
    private restApiService: RestApiService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.clientService.setPage('projects');
  }


  ngOnInit(): void {
    
    this.newProjectForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      posmPlacementModule: new FormControl(false, Validators.required),
      salesAndOrdersModule: new FormControl(false, Validators.required),
      marketSensingModule: new FormControl(false, Validators.required),
      giveawaysModule: new FormControl(false, Validators.required),
      contactPeople: new FormArray([]),
      brands: new FormArray([]),
      products: new FormArray([]),
    });
    this.contactPeopleFormArray = this.newProjectForm.get('contactPeople') as FormArray;
    

    // Check if the project is set
    this.projectId = this.route.snapshot.params['id'];
    if(this.projectId != undefined) {

      Promise.all([
        this.restApiService.getAuth('project/' + this.projectId),
        this.restApiService.getAuth('admin/regions'),
        this.restApiService.getAuth('posm'),
        this.restApiService.getAuth('giveaway'),
        this.restApiService.getAuth('classification/categories'),
        this.restApiService.getAuth('classification/classifications')
      ])
      .then((data: any[]) => {
        this.project = data[0]
        this.newProjectForm.controls['name'].setValue(this.project.name)
        this.newProjectForm.controls['from'].setValue(this.project.from)
        this.newProjectForm.controls['to'].setValue(this.project.to)
        this.newProjectForm.controls['posmPlacementModule'].setValue(this.project.posmPlacementModule)
        this.newProjectForm.controls['salesAndOrdersModule'].setValue(this.project.salesAndOrdersModule)
        this.newProjectForm.controls['marketSensingModule'].setValue(this.project.marketSensingModule)
        this.newProjectForm.controls['giveawaysModule'].setValue(this.project.giveawaysModule)

        for (const contactPerson of this.project.contactPeople) {
          this.contactPeopleFormArray.push(this.fb.group({
            _id: new FormControl(contactPerson._id, [Validators.required]),
            name: new FormControl(contactPerson.name, [Validators.required]),
            position: new FormControl(contactPerson.position, [Validators.required]),
            email: new FormControl(contactPerson.email, [Validators.required]),
            phone: new FormControl(contactPerson.phone, [Validators.required]),
          }));
        }

        this.regions = data[1];
        for (const key in this.regions) {
            for (const rgn of this.project.regions) {
              if(this.regions[key]._id == rgn._id) {
                this.regions[key].selected = true;
                //this.selectRegion(this.regions[key])
              }
            }
        }

        this.posms = data[2];
        for (const key in this.posms) {
            for (const rgn of this.project.posms) {
              if(this.posms[key]._id == rgn._id) {
                this.posms[key].selected = true;
                //this.selectPosm(this.posms[key])
              }
            }
        }

        this.giveaways = data[3];
        for (const key in this.giveaways) {
          for (const rgn of this.project.giveaways) {
            if(this.giveaways[key]._id == rgn._id) {
              this.giveaways[key].selected = true;
              //this.selectGiveaway(this.giveaways[key])
            }
          }
        }

        this.categories = data[4].filter(classification => classification.for == 'outlet');;
        this.restApiService.getAuth('classification/classifications')
        this.onSearchChange('');

        this.classifications = data[5].filter(classification => classification.for == 'outlet');
        this.classifications = this.classifications.filter(classification => (this.categories.filter(category => category.classification == classification._id)).length == 0)
            for (const key in this.classifications) {
              for (const rgn of this.project.classifications) {
                if(this.classifications[key]._id == rgn._id) {
                  this.classifications[key].selected = true;
                  //this.selectGiveaway(this.classifications[key])
                }
              }
        }
        this.onSearchChange('');

        this.clientObservarable = this.clientService.getDataObservable();
        this.clientObservarable.subscribe(arg => {
          this.client = arg.client;
          if (arg.client) {
            this.client.products = [];
            for (const brand of this.client.brands) {
              if (brand.products  !== undefined) {
                this.client.products = this.client.products.concat(brand.products.map(prdt => {
                  prdt.selected = false;
                  prdt.formInput = new FormControl('');
                  return prdt;
                }));
                for(const brnd of this.project.brands) {
                  if(brand._id == brnd._id){ 
                    brand.selected = true;
                    this.selectBrand(brand)
                  }
                }
              }
            }
            this.fetchProducts();
          }
        });
        this.clientService.sendData();

      })
      .catch(error => {
        console.error("Error filling up the project", error)
      })

     
    } else {
      this.addContactPerson();
      this.restApiService.getAuth('admin/regions')
      .then((regions: any[]) => {
        this.regions = regions;
        this.onSearchChange('');
      });

      this.restApiService.getAuth('posm')
        .then((posms: any[]) => {
          this.posms = posms;
          this.onSearchChange('');
        });

        this.restApiService.getAuth('giveaway')
        .then((giveaways: any[]) => {
          this.giveaways = giveaways;
          this.onSearchChange('');
        });

        this.restApiService.getAuth('classification/categories')
        .then((categories: any[]) => {
          this.categories = categories.filter(classification => classification.for == 'outlet');
          this.restApiService.getAuth('classification/classifications')
          .then((classifications: any[]) => {
            this.classifications = classifications.filter(classification => classification.for == 'outlet');
            this.classifications = this.classifications.filter(classification => (this.categories.filter(category => category.classification == classification._id)).length == 0)
          });
        })

        this.clientObservarable = this.clientService.getDataObservable();
        this.clientObservarable.subscribe(arg => {
          this.client = arg.client;

          if (arg.client) {
            this.client.products = [];
            for (const brand of arg.client.brands) {
              if (brand.products  !== undefined) {
                this.client.products = this.client.products.concat(brand.products.map(prdt => {
                  prdt.selected = false;
                  prdt.formInput = new FormControl('');
                  return prdt;
                }));
              }
            }
            this.fetchProducts();
          }
        });
        this.clientService.sendData();
    }
  }

  createForm() {
    
  }

  fetchProducts() {
    this.restApiService.getAuth('product')
    .then((products: any[]) => {
      this.products = products;
      this.onSearchChange('');
    });
  }

  selectBrand(brand) {
    if(brand.products !== undefined) {
    if (brand.selected == false) {
      this.availableProducts = this.availableProducts.filter(product => product.brand._id != brand._id)
    } else {
      let products = brand.products.map(product => {
        if(this.project) {
          let isselected = this.project.products.filter(prdct => prdct._id == product._id);
          product.selected = isselected && isselected.length > 0 ? true : false;
          product.competetiveProducts = isselected && isselected.length > 0  ? isselected[0].competetiveProducts : [] ;
        } else {
          product.selected = false
        }
        return product;

      });
      this.availableProducts = this.availableProducts.concat(products);

    }
    }

  }

  // selectRegion(region) {

  //   console.log(region);

  //   if (region.selected == null || region.selected == false) {
  //     region.selected = true;
  //   } else {
  //     region.selected = false;
  //   }
  // }

  // selectPosm(posm) {
  //   if (posm.selected == null || posm.selected == false) {
  //     posm.selected = true;
  //   } else {
  //     posm.selected = false;
  //   }
  // }

  // selectGiveaway(giveaway) {
  //   if (giveaway.selected == null || giveaway.selected == false) {
  //     giveaway.selected = true;
  //   } else {
  //     giveaway.selected = false;
  //   }
  // }

  onSearchChange(search) {
    this.filteredproducts = this.products.filter(item => {
      if(search == '') {
        const prdts = this.client.products.map(prtd => prtd._id);
        // console.log(prdts);
        if (prdts.indexOf(item._id) == -1) {
          return item;
        }
      } else {
        if (item.name.toLowerCase().includes(search)) {
          const prdts = this.client.products.map(prtd => prtd._id);
          if (prdts.indexOf(item._id) == -1) {
            return item;
          }
        }
      }
    });
  }

  addCompetetiveProduct($event, product) {
    console.log($event);
  }

  selectedCompetitiveProduct($event, product) {
    let competetiveProduct = this.products.filter(prdct => prdct._id == $event.option.value)[0]
    product.competetiveProducts == undefined ? product.competetiveProducts = [competetiveProduct] : product.competetiveProducts.filter(prdct => prdct._id == $event.option.value).length == 0 ?  product.competetiveProducts.push(competetiveProduct) : '';
  }

  selectProduct(product) {
    if (product.selected == true) {
      product.selected = false;
    } else {
       product.selected = true;
    }
  }

  insertCompetetiveProduct(prdct, product) {
    if (product.competetiveProducts.indexOf(prdct) == -1) {
      product.competetiveProducts.push(prdct);
    }
  }

  removeCompetetiveProduct(prdct, product) {
    console.log(product)
    product.competetiveProducts.splice(product.competetiveProducts.indexOf(prdct));
    console.log(product)
  }

  contactPerson(): FormGroup {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  addContactPerson() {
    this.contactPeopleFormArray.push(this.contactPerson());
  }

  removeContactPerson(i) {
    this.contactPeopleFormArray.removeAt(i);
  }

  createProject() {

    // TODO stop multiple submission.

    const projectData = this.newProjectForm.value;
    if(this.project) {
      projectData._id = this.project._id
    }


    projectData.products = this.client.products.filter(prdct => prdct.selected).map(product => {
      return {
          product : product._id, 
          competetiveProducts : product.competetiveProducts ? product.competetiveProducts.map(pp => pp._id) : []
        }
      
    });

    projectData.brands = this.client.brands.filter(brand => brand.selected).map(brand => brand._id);
    projectData.regions = this.regions.filter(region => region.selected).map(region => region._id);
    projectData.posms = this.posms.filter(posm => posm.selected).map(posm => posm._id);
    projectData.classifications = this.classifications.filter(classification => classification.selected).map(classification => classification._id);
    projectData.giveaways = this.giveaways.filter(giveaway => giveaway.selected).map(giveaway => giveaway._id);
    projectData.client = this.client._id;

    

    if (projectData.marketSensingModule == false && projectData.salesAndOrdersModule == false && projectData.posmPlacementModule == false && projectData.giveawaysModule == false) {
      this.snackBar.open('Please select atleast one module', 'Close', {
        verticalPosition: 'top'
      });
      return;
    }

    if (projectData.posmPlacementModule == true && projectData.posms.length == 0) {
      this.snackBar.open('Please select atleast one posms type', 'Close', {
        verticalPosition: 'top'
      });
      return
    }

    if (projectData.giveawaysModule == true && projectData.giveaways.length == 0) {
      this.snackBar.open('Please select atleast one posms type', 'Close', {
        verticalPosition: 'top'
      });
      return
    }

     if ((projectData.marketSensingModule == true || projectData.salesAndOrdersModule == true) && projectData.brands.length == 0) {
      this.snackBar.open('Please select atleast one brand', 'Close', {
        verticalPosition: 'top'
      });
      return;
    }


    if ((projectData.marketSensingModule == true || projectData.salesAndOrdersModule == true) && projectData.products.length == 0) {
      this.snackBar.open('Please select atleast one product', 'Close', {
        verticalPosition: 'top'
      });
      return
    }

   
    

    if (projectData.regions.length == 0) {
      this.snackBar.open('Please select atleast one region', 'Close', {
        verticalPosition: 'top'
      });
      return;
    }

    if (!projectData.from && !projectData.to) {
      this.snackBar.open('Please set the dates', 'Close', {
        verticalPosition: 'top'
      });
      return;
    }

    if (!projectData.name) {
      this.snackBar.open('Please add a name to the project', 'Close', {
        verticalPosition: 'top'
      });
      return;
    }

    

    if(projectData._id != undefined) {
      this.restApiService.putAuth('project/' + projectData._id, projectData)
      .then((data: any) => {
        console.log(data);
        this.router.navigate([ 'project/' + data._id ]);
      })
      .catch(err => {
        this.snackBar.open('Error updating Project', 'Close', {
          verticalPosition: 'top'
        });
      });
    } else {

      this.dissabled = true;

      console.log(projectData.brands);

      this.restApiService.postAuth('project/create', projectData)
      .then((data: any) => {
        console.log(data);
        this.router.navigate([ 'project/' + data._id ]);
      })
      .catch(err => {
        this.snackBar.open('Error creating Project', 'Close', {
          verticalPosition: 'top'
        });
      });

    }

  }

  trackByFn(index: any, item: any) {
    return index;
  }

}

