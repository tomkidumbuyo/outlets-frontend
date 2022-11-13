import { Injectable } from '@angular/core';
import * as e from 'cors';
import { Subject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  
  projects: any[] = [];
  selectedProject: any;
  private dataSource = new Subject();
  page = 'dashboard';

  loadingMessage = 'Data started loading ...';


  dataLoaded = false;
  users: any[]  = [];
  temps: any[] = [];

  regions = []
  outlets = []
  visits = []
  posms = []
  giveaways = [];
  sales = [];
  classifications = [];
  outletProducts = [];
  outletSkus = [];
  all: any;
  from: Date;
  to: Date;
  newOutlets: any[];
  user: any;

  

  constructor(
    private restApiService: RestApiService,
    private auth: AuthenticationService,
  ) {
    this.fetch();
  }

  fetch() {

    this.auth.isLoggedIn()
    .then((data: any) => {
      this.user = data;
     

      this.restApiService.getAuth('project')
      .then((projects: any[]) => {
        if(this.user.type == "client") {
          this.projects = projects.filter(project => project.client._id == this.user.client)
        } else {
          this.projects = projects;
        }
        
        this.sendData();
      })
      .catch(error => {

      });
      
    })
    .catch(err => {

    });
   
  }

  setFilterVariables(filterVariables: { regionModel: any; districtModel: any; wardModel: any; categoryModel: any; query: any; }) {
    
  }

  setTimeFilter( from: Date, to: Date) {
    this.from = from;
    this.to = to;
    this.processData();
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

  selectProject(project) {
    if(project && project.products && project.products.length) {
      this.selectedProject = project;
      this.fetchData();
    } else if(project._id) {
      this.restApiService.getAuth('project/' + project._id)
      .then((project: any[]) => {
        this.selectedProject = project;
        this.fetchData();
      })
      .catch(error => {
        console.error(error)
      });
    } 

  }

  
  sendData() {
    this.dataSource.next({
      projects: this.projects,
      page: this.page,
      users: this.users,
      project: this.selectedProject,
      regions: this.regions,
      loadingMessage: this.loadingMessage,
      dataLoaded: this.dataLoaded,
      all: this.all,
      visits: this.visits,
      outlets: this.outlets,
      newOutlets: this.newOutlets
    });
  }


  fetchData() {
    if(this.selectedProject && this.selectedProject._id) {
      this.dataLoaded = false;
      this.loadingMessage = 'Loading data ... ';
      this.sendData();

      Promise.all([
        this.getUsers(),
        this.getLocation(),
        this.getClassifications(),
        this.getVisits(),
        this.getSales(),
        this.getGiveaways(),
        this.getPosms(),
        this.getOutlets(),
        this.getProducts(),
        this.getSkus(),
        this.getNewOutlets(),
      ])
      .then((users: any[]) => {
        this.processData();
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  getUsers() {
    this.restApiService.getAuth('project/' + this.selectedProject._id + '/temps')
    .then((temps: any[]) => {
      this.temps = temps;
      this.users = this.temps.map(temp => {
        let t = temp.user;
        t.temp = temp;
        return t
      });
  
      this.sendData();
    })
    .catch(error => {

    });
  }

  getLocation() {
    return new Promise(async (resolve, reject) => {
    this.restApiService.getAuth('project/' + this.selectedProject._id + '/locations')
    .then((regions: any[]) => {
      this.regions = regions;
      resolve(regions);
    })
    .catch(error => {

    });
  })
  }

  getClassifications() {
    return new Promise(async (resolve, reject) => {
    this.restApiService.getAuth('classification/classifications')
      .then((classifications: any[]) => {
        this.classifications = classifications;
        resolve(classifications);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getSales() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/sales')
      .then((data: any[]) => {
        this.sales = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getGiveaways() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/giveaways')
      .then((data: any[]) => {
        this.giveaways = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getPosms() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/posms')
      .then((data: any[]) => {
        this.posms = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  // getPosmVisibility() {
  //   return new Promise(async (resolve, reject) => {
  //     this.restApiService.getAuth('project/' + this.selectedProject._id + '/posmvisibility')
  //     .then((data: any[]) => {
  //       this.outletProducts = data;
        
  //       resolve(data);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       reject(err);
  //     });
  //   });
  // }

  getSkus() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/skus')
      .then((data: any[]) => {
        this.outletSkus = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getProducts() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/products')
      .then((data: any[]) => {
        this.outletProducts = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getOutlets() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/outlets')
      .then((data: any[]) => {
        this.outlets = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getNewOutlets() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/newoutlets')
      .then((data: any[]) => {
        this.newOutlets = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  getVisits() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.selectedProject._id + '/visits')
      .then((data: any[]) => {
        this.visits = data;
        resolve(data);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }


  processData() {

    this.selectedProject.skus = [].concat.apply([], this.selectedProject.products.map(product => product.skus));
    

    let all = {
      newOutlets: [],
      visitedOutlets: [],
      outlets: []
    };

    this.visits = this.visits.map(visit => {
        if(!visit.user._id) {
          visit.user = this.users.filter(user => user._id == visit.user)[0]
        }
        return visit;
    })


    all = this.addLocationStructure(all);
    let regions = this.regions.map(region => {

      region = this.addLocationStructure(region);
      region.districts = region.districts.map(district => {
        district = this.addLocationStructure(district);
        district.wards = district.wards.map((ward) => {
          ward = this.addLocationStructure(ward);
          let outlets: any = [];
          outlets = this.getWardOutlets(ward);
          for (const outlet of outlets) {
            ward = this.addLocationVisit(ward, outlet);
            district = this.addLocationVisit(district, outlet);
            region = this.addLocationVisit(region, outlet);
            all = this.addLocationVisit(all, outlet);
          }
          ward.newOutlets = this.newOutlets.filter(outlet => outlet.ward._id == ward._id)
          ward.visitedOutlets = ward.outlets.filter(outlet => outlet.visits.length > 0)
          return ward;
        });
        district.newOutlets = this.newOutlets.filter(outlet => outlet.district._id == district._id)
        district.visitedOutlets = district.outlets.filter(outlet => outlet.visits.length > 0)
        return district;
      });

      region.newOutlets = this.newOutlets.filter(outlet => outlet.region._id == region._id)
      region.visitedOutlets = region.outlets.filter(outlet => outlet.visits.length > 0)

      return region;

    });

    all.newOutlets = this.newOutlets;
    all.visitedOutlets = all.outlets.filter(outlet => outlet.visits.length > 0);

    this.regions = regions;
    this.all = all;
    this.dataLoaded = true;
    this.formatUsers()
    this.sendData();

  }


  getWardOutlets(ward: any) {
 
      let outlets = this.outlets.filter(outlet => outlet.ward._id == ward._id);
      //outlets = outlets.map(outlet => {
      let results = [];

      for (const outlet of outlets) {
        
        outlet.visits = this.getOutletVisits(outlet);
        outlet.posms = this.selectedProject.posms.map(posm => {
          JSON.parse(JSON.stringify(posm))
          posm.added = 0;
          posm.removed = 0;
          return JSON.parse(JSON.stringify(posm));
        });
    
        outlet.products = this.selectedProject.products.map(product => {
          product.stock = 0;
          product.visible = 0;
          product.invisible = 0;
          product.sold = 0;
          product.soldPrice = 0;
          product.ordered = 0;
          product.canceled = 0;
          product.delivered = 0;
          product.orderedPrice = 0;
          product.posmsVisibilities = this.selectedProject.posms.map(pos => {
            pos = {posm : pos};
            pos.saved = false;
            pos.visible = false;
            return pos;
          });
          product.skus = product.skus.map(sku => {
            sku.stock = 0;
            sku.visible = 0;
            sku.invisible = 0;
            sku.sold = 0;
            sku.soldPrice = 0;
            sku.ordered = 0;
            sku.orderedPrice = 0;
            sku.canceled = 0;
            sku.delivered = 0;
            return JSON.parse(JSON.stringify(sku));
          })
          
          
          return JSON.parse(JSON.stringify(product));

        });

        
    
        outlet.giveaways = this.selectedProject.giveaways.map(giveaway => {
          giveaway.amount = 0;
          return giveaway;
        });

        for (const visit of outlet.visits) {

          outlet.posms = outlet.posms.map(posm =>  {
              let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
              if(p.length) {
                posm.added += parseInt(p[0].added);
                posm.removed += parseInt(p[0].removed);
              }
              return posm;
          });
      

          outlet.giveaways = outlet.giveaways.map(giveaway =>  {
            let p =  visit.giveaways.filter(giveawaym => giveawaym.giveaway != null && giveawaym.giveaway._id == giveaway._id)
            if(p.length) {
              giveaway.amount += parseInt(p[0].amount);
            }
            return giveaway;
          });

          outlet.products = outlet.products.map(prdt => {


            let ps =  visit.skus.filter(sku => prdt.skus.map(sku => sku._id).includes(sku.sku))

            for (const p of ps) {
              prdt.stock += p.stock ? 1 : 0;
              prdt.visible += p.visibility ? 1 : 0;
              prdt.invisible += p.visibility? 0 : 1;
            }
            
            for (const sale of visit.sales) {
              let is =  sale.items.filter(item => prdt.skus.map(sku => sku._id).includes(item.sku))
              for (const i of is) {
                if(sale.order == true) {
                  prdt.ordered += parseInt(i.amount);
                  if(sale.delivered) {
                    prdt.delivered += parseInt(i.amount);
                  }
                  if(sale.canceled) {
                    prdt.canceled += parseInt(i.amount);
                  }
                  prdt.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
                } else {
                  prdt.sold += parseInt(i.amount);
                  prdt.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
                }
              }
            }

            prdt.skus = prdt.skus.map(sku => {

              let ps =  visit.skus.filter(product => sku._id == product.sku)

              for (const p of ps) {
                sku.stock += p.stock ? 1 : 0;
                sku.visible += p.visibility ? 1 : 0;
                sku.invisible += p.visibility ? 0 : 1;

                if(p.price) {

                  if(parseInt(p.price) == parseInt(sku.price) || parseInt(p.price) == 0) {
                    sku.priceComplied += 1;
                  } else if(parseInt(p.price) > parseInt(sku.price)) {
                    sku.priceAbove += 1;
                  } else if(parseInt(p.price) < parseInt(sku.price)) {
                    sku.priceBelow += 1;
                  }

                    
  
                }
              }
              
              for (const sale of visit.sales) {
                let is =  sale.items.filter(item =>  sku._id == item.sku)
                for (const i of is) {
                  if(sale.order == true) {
                    sku.ordered += parseInt(i.amount);
                    if(sale.delivered) {
                      sku.delivered += parseInt(i.amount);
                    }
                    if(sale.canceled) {
                      sku.canceled += parseInt(i.amount);
                    }
                    sku.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
                  } else {
                    sku.sold += parseInt(i.amount);
                    sku.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
                  }
                }
              }
              return sku;
            })

            let pt =  visit.products.filter(product => prdt._id == product.product)
           
            

            if(pt.length) {
              
              prdt.posmsVisibilities = prdt.posmsVisibilities.map(posmsVisibility => {
                let pp =  pt[0].posms.filter(posmu => posmsVisibility.posm._id == posmu.posm._id)[0]
                  // posmsVisibility.saved = pp.saved ? true : posmsVisibility.saved;
                  if(pp){
                    posmsVisibility.saved = true ;
                    posmsVisibility.visible = pp.visible ? true : posmsVisibility.visible;
                  }
                return posmsVisibility;
              })

            }

            return prdt;

          });
        }
        
        results.push(outlet);
      }
  
      return results;
  }

  formatUsers() {

    this.users = this.users.map(user => {

      user.visits = this.getUserVisits(user);

      user.posms = this.selectedProject.posms.map(posm => {
        posm.added = 0;
        posm.removed = 0;
        return JSON.parse(JSON.stringify(posm));
      });
  
      user.products = this.selectedProject.products.map(product => {
        product.stock = 0;
        product.visible = 0;
        product.invisible = 0;
        product.sold = 0;
        product.soldPrice = 0;
        product.ordered = 0;
        product.orderedPrice = 0;
        product.canceled = 0;
        product.delivered = 0;
        product.skus = product.skus.map(sku => {
          sku.stock = 0;
          sku.priceComplied = 0;
          sku.priceBelow = 0;
          sku.visible = 0;
          sku.invisible = 0;
          sku.sold = 0;
          sku.soldPrice = 0;
          sku.ordered = 0;
          sku.orderedPrice = 0;
          sku.canceled = 0;
          sku.delivered = 0;
          return JSON.parse(JSON.stringify(sku));
        })
        return JSON.parse(JSON.stringify(product));
      });
  
      user.giveaways = this.selectedProject.giveaways.map(giveaway => {
        giveaway.amount = 0;
        return giveaway;
      });

      for (const visit of user.visits) {

        user.posms = user.posms.map(posm =>  {
            let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
            if(p.length) {
              posm.added += parseInt(p[0].added);
              posm.removed += parseInt(p[0].removed);
            }
            return posm;
        });
    
        user.giveaways = user.giveaways.map(giveaway =>  {
          
          let p =  visit.giveaways.filter(giveawaym => giveawaym.giveaway != null && giveawaym.giveaway._id == giveaway._id)
          if(p.length) {
            giveaway.amount += parseInt(p[0].amount);
          }
          return giveaway;
        });

        user.products = user.products.map(prdt => {

          let ps =  visit.skus.filter(product => prdt.skus.includes(product.sku))
          for (const p of ps) {
            prdt.stock += parseInt(p.stock);
            prdt.visible += p.visibility ? 1 : 0;
            prdt.invisible += p.visibility ? 0 : 1;
          }
          
          for (const sale of visit.sales) {

            let is =  sale.items.filter(item => prdt.skus.map(sku => sku._id).includes(item.sku))
            for (const i of is) {
              if(sale.order == true) {
                if(sale.delivered) {
                  prdt.delivered += parseInt(i.amount);
                }
                if(sale.canceled) {
                  prdt.canceled += parseInt(i.amount);
                }
                prdt.ordered += parseInt(i.amount);
                prdt.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
              } else {
                prdt.sold += parseInt(i.amount);
                prdt.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
              }
            }
          }

          prdt.skus = prdt.skus.map(sku => {

            let ps =  visit.skus.filter(product => sku._id == product.sku)
            for (const p of ps) {
              if(p.price) {

                if(parseInt(p.price) == parseInt(sku.price) || parseInt(p.price) == 0) {
                  sku.priceComplied += 1;
                } else if(parseInt(p.price) > parseInt(sku.price)) {
                  sku.priceAbove += 1;
                } else if(parseInt(p.price) < parseInt(sku.price)) {
                  sku.priceBelow += 1;
                }
                // sku.priceComplied += parseInt(p.price);
                // sku.priceAbove = parseInt(p.price) > sku.priceAbove ? parseInt(p.price) : sku.priceAbove;
                // sku.priceBelow += 1;
              }
              sku.stock += parseInt(p.stock);
              sku.visible += p.visibility ? 1 : 0;
              sku.invisible += p.visibility ? 0 : 1;
            }
            
            for (const sale of visit.sales) {
              let is =  sale.items.filter(item => product => sku._id == item.sku)
              for (const i of is) {
                if(sale.order == true) {
                  if(sale.delivered) {
                    sku.delivered += parseInt(i.amount);
                  }
                  if(sale.canceled) {
                    sku.canceled += parseInt(i.amount);
                  }
                  sku.ordered += parseInt(i.amount);
                  sku.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
                } else {
                  sku.sold += parseInt(i.amount);
                  sku.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
                }
              }
            }
            return sku;
          })
         
          return prdt;
        });
      }

      return user;

    });
    
    this.sendData();
  
  }


  addLocationStructure(location) {

    location.visits = [];
    location.outlets = [];
    location.newOutlets = [];
    location.skus = [];

    location.posms = JSON.parse(JSON.stringify(this.selectedProject.posms.map(posm => {
      posm.added = 0;
      posm.removed = 0;
      return posm;
    })));

    location.products = JSON.parse(JSON.stringify(this.selectedProject.products.map(product => {

      product.stock = 0;
      product.visible = 0;
      product.invisible = 0;
      product.sold = 0;
      product.soldPrice = 0;
      product.ordered = 0;
      product.orderedPrice = 0;
      product.canceled = 0;
      product.delivered = 0;
      product.posmsVisibilities = this.selectedProject.posms.map(pos => {
        pos = {posm : pos};
        pos.saved = 0;
        pos.visible = 0;
        return pos;
      });
      product.skus = product.skus.map(sku => {
        sku.stock = 0;
        sku.priceComplied = 0;
        sku.priceAbove = 0;
        sku.priceBelow = 0;
        sku.visible = 0;
        sku.invisible = 0;
        sku.sold = 0;
        sku.name = product.name;
        sku.soldPrice = 0;
        sku.ordered = 0;
        sku.orderedPrice = 0;
        sku.canceled = 0;
        sku.delivered = 0;
        location.skus.push(sku)
        return sku;
      });
      return product;

    })));

    location.giveaways = JSON.parse(JSON.stringify(this.selectedProject.giveaways.map(giveaway => {
      giveaway.amount = 0;
      return giveaway;
    })));

    location.classifications = JSON.parse(JSON.stringify(this.selectedProject.classifications.map(classification => {

      classification.visits = [];
      classification.outlets = [];
      classification.newOutlets = [];
      classification.skus = [];

      classification.posms = JSON.parse(JSON.stringify(this.selectedProject.posms.map(posm => {
        posm.added = 0;
        posm.removed = 0;
        return posm;
      })));
  
      classification.products = JSON.parse(JSON.stringify(this.selectedProject.products.map(product => {
        product.stock = 0;
        product.visible = 0;
        product.invisible = 0;
        product.sold = 0;
        product.soldPrice = 0;
        product.ordered = 0;
        product.orderedPrice = 0;
        product.canceled = 0;
        product.delivered = 0;
        product.skus = product.skus.map(sku => {
          sku.stock = 0;
          sku.priceComplied = 0;
          sku.priceAbove = 0;
          sku.priceBelow = 0;
          sku.visible = 0;
          sku.invisible = 0;
          sku.sold = 0;
          sku.soldPrice = 0;
          sku.ordered = 0;
          sku.orderedPrice = 0;
          sku.canceled = 0;
          sku.delivered = 0;
          classification.skus.push(sku)
          return sku;
        });
        return product;
      })));
  
      classification.giveaways = JSON.parse(JSON.stringify(this.selectedProject.giveaways.map(giveaway => {
        giveaway.amount = 0;
        return giveaway;
      })));
      return classification;
    })));

    return location;

  }

  addLocationVisit(location, outlet): any {

    location.outlets.push(outlet);
    location.visits = location.visits.concat(outlet.visits)

    location.posms = location.posms.map(posm =>  {
        let p =  outlet.posms.filter(posmm => posmm._id == posm._id)
        if(p.length) {
          posm.added = parseInt(posm.added) + parseInt(p[0].added);
          posm.removed = parseInt(posm.removed) + parseInt(p[0].removed);
        }
        return posm;
    });

 

    location.giveaways = location.giveaways.map(giveaway =>  {
      let p =  outlet.giveaways.filter(giveawaym => giveawaym._id == giveaway._id)
     
      if(p.length > 0) {
        giveaway.amount += p[0].amount;
      }
      return giveaway;
    });


    location.products = location.products.map(prdt => {

      let p =  outlet.products.filter(product => prdt._id == product._id)
      if(p.length) {

        prdt.stock += parseInt(p[0].stock);
        prdt.visible += parseInt(p[0].visible);
        prdt.invisible += parseInt(p[0].invisible);
        prdt.sold += parseInt(p[0].sold);
        prdt.soldPrice += parseInt(p[0].soldPrice);
        prdt.ordered += parseInt(p[0].ordered);
        prdt.orderedPrice += parseInt(p[0].orderedPrice);
        prdt.canceled += parseInt(p[0].canceled);
        prdt.delivered += parseInt(p[0].delivered);
        
  

        prdt.skus = prdt.skus.map(sku => {
          let pp =  p[0].skus.filter(skuu => sku._id == skuu._id)
          if(p.length) {

            sku.stock += parseInt(pp[0].stock);
            if(pp[0].price) {
              sku.priceComplied += pp[0].priceComplied;
              sku.priceAbove += pp[0].priceAbove;
              sku.priceBelow += pp[0].priceBelow;
            }
            sku.visible += parseInt(pp[0].visible);
            sku.invisible += parseInt(pp[0].invisible);
            sku.sold += parseInt(pp[0].sold);
            sku.soldPrice += parseInt(pp[0].soldPrice);
            sku.ordered += parseInt(pp[0].ordered);
            sku.orderedPrice += parseInt(pp[0].orderedPrice);
            sku.canceled += parseInt(p[0].canceled);
            sku.delivered += parseInt(p[0].delivered);
            
          }
          return sku;
        })

        

        prdt.posmsVisibilities = prdt.posmsVisibilities.map(posmsVisibility => {
          let pp =  p[0].posmsVisibilities.filter(posmu => posmsVisibility.posm._id == posmu.posm._id)[0]
        
            posmsVisibility.saved += pp.saved ? 1 : 0;
            posmsVisibility.visible += pp.visible ? 1 : 0;
           
          return posmsVisibility;
        })

        
      }

      // console.log('prdt : ',prdt)

      return prdt;
    })

    location.skus = [].concat.apply([], location.products.map(product => product.skus));

    
    location.classifications.map(classification => {
      if(outlet.classifications.filter(cls => cls._id == classification._id).length > 0) {
        classification.outlets.push(outlet);
        classification.visits = classification.visits.concat(outlet.visits)

        classification.posms = classification.posms.map(posm =>  {
            let p =  outlet.posms.filter(posmm => posmm._id == posm._id)
            if(p.length) {
              posm.added = parseInt(posm.added) + parseInt(p[0].added);
              posm.removed = parseInt(posm.removed) + parseInt(p[0].removed);
            }
            return posm;
        });

        classification.giveaways = classification.giveaways.map(giveaway =>  {
          let p =  outlet.giveaways.filter(giveawaym => giveawaym._id == giveaway._id)
        
          if(p.length > 0) {
            giveaway.amount += p[0].amount;
          }
          return giveaway;
        });

        classification.products = classification.products.map(prdt => {
          let p =  outlet.products.filter(product => prdt._id == product._id)
          if(p.length) {
            prdt.stock += parseInt(p[0].stock);
            prdt.visible += parseInt(p[0].visible);
            prdt.invisible += parseInt(p[0].invisible);
            prdt.sold += parseInt(p[0].sold);
            prdt.soldPrice += parseInt(p[0].soldPrice);
            prdt.ordered += parseInt(p[0].ordered);
            prdt.orderedPrice += parseInt(p[0].orderedPrice);
            prdt.canceled += parseInt(p[0].canceled);
            prdt.delivered += parseInt(p[0].delivered);

            prdt.skus = prdt.skus.map(sku => {

              let pp =  p[0].skus.filter(skuu => sku._id == skuu._id)
              if(p.length) {
                sku.stock += parseInt(pp[0].stock);

                

                if(pp[0].price) {
                  sku.priceComplied += pp[0].priceComplied;
                  sku.priceAbove += pp[0].priceAbove;
                  sku.priceBelow += pp[0].priceBelow;
                }
                sku.visible += parseInt(pp[0].visible);
                sku.invisible += parseInt(pp[0].invisible);
                sku.sold += parseInt(pp[0].sold);
                sku.soldPrice += parseInt(pp[0].soldPrice);
                sku.ordered += parseInt(pp[0].ordered);
                sku.orderedPrice += parseInt(pp[0].orderedPrice);
                sku.canceled += parseInt(p[0].canceled);
                sku.delivered += parseInt(p[0].delivered);
              }
              return sku;
            })
          }
          return prdt;
        })
      }
      return classification;
    })

    return location;

  }

  getOutletVisits(outlet: any) {
    let visits = this.visits
      .filter(visit => visit.outlet == outlet._id)
      .map(visit => {
        visit.sales = this.sales.filter(sale => sale.visit == visit._id)
        visit.posms = this.posms.filter(posm => posm.visit == visit._id)
        visit.giveaways = this.giveaways.filter(giveaway => giveaway.visit == visit._id)
        visit.skus = this.outletSkus.filter(outletSku => outletSku.visit == visit._id)
        visit.products = this.outletProducts.filter(product => product.visit == visit._id)
        return visit;
      })

    if(this.from != null && this.to != null) {
      visits = visits.filter(visit => this.from.getTime() < new Date(visit.date).getTime() && this.to.getTime() > new Date(visit.date).getTime())
    }
    return visits;
  }

  getUserVisits(user: any) {

    let visits = this.visits
      .filter(visit => visit.user == user._id || visit.user._id == user._id)
      .map(visit => {
        visit.sales = this.sales.filter(sale => sale.visit == visit._id)
        visit.posms = this.posms.filter(posm => posm.visit == visit._id)
        visit.giveaways = this.giveaways.filter(giveaway => giveaway.visit == visit._id)
        visit.skus = this.outletSkus.filter(outletSku => outletSku.visit == visit._id)
        visit.products = this.outletProducts.filter(product => product.visit == visit._id)
        return visit;
      })

      

    if(this.from != null && this.to != null) {
      visits = visits.filter(visit => this.from.getTime() < new Date(visit.date).getTime() && this.to.getTime() > new Date(visit.date).getTime())
    }
    return visits;
  }

  

}
