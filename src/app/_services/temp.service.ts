import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RestApiService } from './rest-api.service';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

@Injectable({
  providedIn: 'root'
})
export class TempService {
  
  page: any;
  selectedProject: any;
  temp: any;
  id: any;
  project: any;

  timeAgo = new TimeAgo('en-US')

  private dataSource = new Subject();
  visits: any[];
  movements: any[];
  outlets: any[];
  allOutlets: any[];
  products: any[];
  posms: any[];
  giveaways: any[];
  sales: any[];
  from: Date;
  to: Date;
  days: any[];
  report: any;
  weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  

  constructor(
    private restApiService: RestApiService,
  ) {
    
  }

  


  setId(id: any) {
    
    this.id = id;
    this.restApiService.getAuth('temp/' + id)
    .then((temp: any) => {
      this.temp = temp;
      this.fetchData();
      this.sendData();
    })
    .catch(error => {
      console.log('Error getting temp : ', error)
    });
  }

 
  setPage(page) {
    console.log('set page', page);
    this.page = page;
    this.sendData();
  }

  getPage() {
    return this.page;
  }

  getDataObservable() {
    return this.dataSource;
  }


  async fetchData() {

      Promise.all([
        this.getMovements(),
        this.getVisits(),
        this.getOutlets(),
        this.getAllOutlets(),
        this.getSales(),
        this.getGiveaways(),
        this.getPosms(),
        this.getProducts(),
        this.getProject()
      ])
      .then((users: any[]) => {
        this.processData();
      })
      .catch(err => {
        console.error(err);
      });
    
  }

  getProject() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('project/' + this.temp.project._id)
      .then(project => {
        this.project = project;
        this.from = new Date(this.project.from);
        this.to = new Date(this.project.to).getTime() > new Date().getTime() ? new Date() : new Date(this.project.to);
        resolve(this.project);
      })
      .catch(error => {
        reject(error)
      });
    })
  }

  getMovements() {
    return new Promise(async (resolve, reject) => {
    this.restApiService.getAuth('temp/' + this.id + '/locations')
    .then((movements: any[]) => {
      this.movements = movements.reverse().map(movement => {
        movement.timeago = (new Date().getTime() - new Date(movement.time).getTime()) > 60*60*24*1000 ? this.toShortTimeFormat(new Date(movement.time)) : this.timeAgo.format(new Date(movement.time));
        movement.totimeago = (new Date().getTime() - new Date(movement.to_time).getTime()) > 60*60*24*1000 ? this.toShortTimeFormat(new Date(movement.to_time)) : this.timeAgo.format(new Date(movement.to_time));
        return movement;
      });
      //console.log("movements : ", this.movements)
      resolve(this.movements);
    })
    .catch(error => {
      reject(error)
      console.log('Error getting temp movements : ', error)
    });
   })
  }

  getVisits() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/visits')
      .then((visits: any[]) => {
        this.visits = visits;
        resolve(this.visits);
        //console.log("vists : ", this.visits)
      })
      .catch(error => {
        reject(error)
        console.log('Error getting temp movements : ', error)
      });
     })
  }

  getOutlets() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/outlets')
      .then((outlets: any[]) => {
        this.outlets = outlets;
        resolve(this.outlets);
        //console.log("outlets : ", this.outlets)
      })
      .catch(error => {
        reject(error)
        console.log('Error getting temp movements : ', error)
      });
     })
  }

  getAllOutlets() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/allOutlets')
      .then((allOutlets: any[]) => {
        this.allOutlets = allOutlets;
        resolve(this.allOutlets);
        console.log("this.allOutlets : ", this.allOutlets)
      })
      .catch(error => {
        reject(error)
        console.log('Error getting temp movements : ', error)
      });
     })
  }

  getSales() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/sales')
      .then((data: any[]) => {
        this.sales = data;
        //console.log("sales : ", this.sales)
        resolve(this.sales);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  getGiveaways() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/giveaways')
      .then((data: any[]) => {
        this.giveaways = data;
        //console.log("giveaways : ", this.giveaways)
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  getPosms() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/posms')
      .then((data: any[]) => {
        this.posms = data;
        //console.log("posms : ", this.posms)
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  getProducts() {
    return new Promise(async (resolve, reject) => {
      this.restApiService.getAuth('temp/' + this.id + '/products')
      .then((data: any[]) => {
        this.products = data;
        //console.log("products : ", this.products)
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  

  sendData() {
    this.dataSource.next({
      page: this.page,
      temp: this.temp,
      report: this.report,
      days: this.days,
      posms: this.posms,
      project: this.project,
      giveaways: this.giveaways,
    });
  }


  processData() {
    

    this.visits = this.visits
    .map(visit => {
        visit.sales = this.sales.filter(sale => sale.visit == visit._id)
        visit.posms = this.posms.filter(posm => posm.visit == visit._id)
        visit.giveaways = this.giveaways.filter(giveaway => giveaway.visit == visit._id)
        visit.products = this.products.filter(product => product.visit == visit._id)
        visit.outlet = this.allOutlets.filter(outlet => visit.outlet == outlet._id)[0]
        return visit;
    })

    console.log('this.visits : ', this.visits)

    this.days = this.dataToDays();
    this.sendData();

  }

  toShortFormat = function(d) {

    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    let day = d.getDate();
    let monthIndex = d.getMonth();
    let monthName = monthNames[monthIndex];
    let year = d.getFullYear();
    return `${monthName} ${day}, ${year}`;  

  }

  toShortTimeFormat = function(d) {

    
    let h = this.pad_with_zeroes(d.getHours(), 2);
    let m = this.pad_with_zeroes(d.getMinutes(), 2);
    let s = this.pad_with_zeroes(d.getSeconds(), 2);


    return ` ${h} : ${m} : ${s}`;  

  }


  dataToDays() {

    let periods = []
    let firstday = this.from;
    let lastday = this.to;
    const diffDays = Math.round(Math.abs((lastday.getTime() - firstday.getTime()) / (24 * 60 * 60 * 1000)))

    this.report = {
      outlets: this.outlets,
      start: this.from,
      end: this.to,
      visits: this.visits,
      movements: this.movements,
      products: [],
      posms: [],
      giveaways: [],
      sales: [],
    }

    this.report.posms = this.project.posms.map(posm => {
      posm.added = 0;
      posm.removed = 0;
      return JSON.parse(JSON.stringify(posm));
    });

    this.report.products = this.project.products.map(product => {
      product.stock = 0;
      product.visible = 0;
      product.invisible = 0;
      product.sold = 0;
      product.soldPrice = 0;
      product.ordered = 0;
      product.orderedPrice = 0;
      return JSON.parse(JSON.stringify(product));
    });

    this.report.giveaways = this.project.giveaways.map(giveaway => {
      giveaway.amount = 0;
      return giveaway;
    });

    for (const visit of this.report.visits) {

      this.report.posms = this.report.posms.map(posm =>  {
          let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
          if(p.length) {
            posm.added += parseInt(p[0].added);
            posm.removed += parseInt(p[0].removed);
          }
          return posm;
      });
  
      this.report.giveaways = this.report.giveaways.map(giveaway =>  {
        let p =  visit.giveaways.filter(giveawaym => giveawaym.giveaway != null && giveawaym.giveaway._id == giveaway._id)
        if(p.length) {
          giveaway.amount += parseInt(p[0].amount);
        }
        return giveaway;
      });

      this.report.products = this.report.products.map(prdt => {

       
        let ps =  visit.products.filter(product => prdt.skus.includes(product.sku))
        //console.log('PRODUCTS  : ', ps)
        for (const p of ps) {
          prdt.stock += parseInt(p.stock);
          prdt.visible += p.visible ? 1 : 0;
          prdt.invisible += p.visible ? 0 : 1;
        }
        
        for (const sale of visit.sales) {
          let is =  sale.items.filter(item => prdt.skus.includes(item.sku))
          for (const i of is) {
            if(sale.order == true) {
              prdt.ordered += parseInt(i.amount);
              prdt.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
            } else {
              prdt.sold += parseInt(i.amount);
              prdt.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
            }
          }
        }
        return prdt;
      });

      
    }

    let weekstart = new Date(firstday.getTime())
    let weekend = new Date(firstday.getTime())
    weekend.setDate(weekend.getDate() + 1)

    for(let i = 0; i < diffDays + 1; i++) {

      let week = {
        start: new Date(weekstart.getTime()),
        end: new Date(weekend.getTime()),
        datestring: this.toShortFormat(weekstart),
        weekday: this.weekDays[weekstart.getDay()],
        visits: this.visits.filter(visit => weekstart.getTime() < new Date(visit.date).getTime() && weekend.getTime() >= new Date(visit.date).getTime()),
        movements: this.movements.filter(movement => weekstart.getTime() < new Date(movement.time).getTime() && weekend.getTime() >= new Date(movement.time).getTime()),
        products: [],
        posms: [],
        giveaways: [],
        sales: [],
      }

      week.posms = this.posms.map(posm => {
        posm.added = 0;
        posm.removed = 0;
        return JSON.parse(JSON.stringify(posm));
      });

      week.products = this.project.products.map(product => {
        product.stock = 0;
        product.visible = 0;
        product.invisible = 0;
        product.sold = 0;
        product.soldPrice = 0;
        product.ordered = 0;
        product.orderedPrice = 0;
        return JSON.parse(JSON.stringify(product));
      });
  
      week.giveaways = this.giveaways.map(giveaway => {
        giveaway.amount = 0;
        return giveaway;
      });

      for (const visit of week.visits) {

        week.posms = week.posms.map(posm =>  {
            let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
            if(p.length) {
              posm.added += parseInt(p[0].added);
              posm.removed += parseInt(p[0].removed);
            }
            return posm;
        });
    
        week.giveaways = week.giveaways.map(giveaway =>  {
          let p =  visit.giveaways.filter(giveawaym => giveawaym.giveaway != null && giveawaym.giveaway._id == giveaway._id)
          if(p.length) {
            giveaway.amount += parseInt(p[0].amount);
          }
          return giveaway;
        });

        week.products = week.products.map(prdt => {
         

          let ps =  visit.products.filter(product => prdt.skus.includes(product.sku))
          //console.log('PRODUCTS  : ', ps)
          for (const p of ps) {
            prdt.stock += parseInt(p.stock);
            prdt.visible += p.visible ? 1 : 0;
            prdt.invisible += p.visible ? 0 : 1;
          }
          
          for (const sale of visit.sales) {
            let is =  sale.items.filter(item => prdt.skus.includes(item.sku))
            for (const i of is) {
              if(sale.order == true) {
                prdt.ordered += parseInt(i.amount);
                prdt.orderedPrice += parseInt(i.amount)*parseInt(i.priceEach);
              } else {
                prdt.sold += parseInt(i.amount);
                prdt.soldPrice += parseInt(i.amount)*parseInt(i.priceEach);
              }
            }
          }
          return prdt;
        });

        
      }

      //console.log('week : ', week)

      periods.push(week);
      weekstart.setDate(weekstart.getDate() + 1);
      weekend.setDate(weekend.getDate() + 1)
      
    }
    return periods;
  }


  pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

  }


}
