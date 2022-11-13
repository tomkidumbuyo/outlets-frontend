import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { } from 'c3-angular'

declare var $: any;
declare var CanvasJS: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  ///[x: string]: any;

  projectDataObserver: any;

  regionModel: any = null;
  districtModel: any = null;
  wardModel: any = null;
  categoryModel: any = null;
  queryModel = null;

  filteredDistricts = [];
  filteredWards = [];
 
  selectedLocation: any;
  selectedLocationType: string;
  selectedLRegion: any;
  selectedDistrict: any;
  selectedChildrenType: string;
  temps = [];

  project: any;
  all: any;
  regions: any[];
  visits: any[];
  outlets: any[];
  newOutlets: any[];
  users: any[];

  from: Date;
  to: Date;
  weeks: any[];

  public barChartPlugins = [];
 

  visitsGraph = {
    data: [
      {data: [], label: 'Visits' },
      {data: [], label: 'New Outlets'  },
    ],
    labels: []
  }
  
  posmsAddedGraph = {
    data: [],
    labels: []
  }

  posmsRemovedGraph = {
    data: [],
    labels: []
  }

  giveawaysGraph = {
    data:  [],
    labels: []
  }

  salesGraph = {
    data: [],
    labels: []
  }

  productClassificationGraph = {
    data:  [],
    labels: []
  }

  visitsChart = {
    data: [],
    label: []
  }

  newOutletsChart = {
    data: [],
    label: []
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.  
  };

  lineChartOptions  = {
    responsive: true,
    scales: {
      y: {
          beginAtZero: true
      }
    }
    
  };

  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  

 
  dataLoaded: boolean = false;

  time = new Date();
  loadingMessage: any = '';

  constructor(
    private projectService: ProjectService,
    private auth: AuthenticationService,
    private router: Router,
    private restApi: RestApiService
  ) {

    // this.drawGraph();
    this.projectDataObserver = this.projectService.getDataObservable();
    this.projectDataObserver.subscribe((arg: any) => {
      
      this.loadingMessage = arg.loadingMessage;
      //this.nationalReport = arg.nationalReport;
      this.dataLoaded     = arg.dataLoaded;


      let data = Object.assign({}, arg);
      
      this.loadingMessage = data.loadingMessage;
      this.project        = data.project;
      this.all            = data.all;
      this.regions        = data.regions;
      this.visits         = data.visits;
      this.outlets        = data.outlets;
      this.newOutlets     = data.newOutlets;
      this.users          = data.users;
    
      
      if(arg.all && this.regions.length && this.project && this.project.from && this.visits) {
          this.from = new Date(this.project.from);
          this.to = new Date(this.project.to)
          this.selectRegion(null)
      }


    });
    this.projectService.setPage('dashboard');
  

  }

  ngOnInit() {
    
  }

  

  visitsToDays(days) {


    let periods = []
    let firstday = new Date(this.from.setDate(this.from.getDate() - this.from.getDay()));
    let lastday = new Date(this.to.setDate(this.to.getDate() - this.to.getDay()+days));
    const diffDays = Math.round(Math.abs((lastday.getTime() - firstday.getTime()) / (24 * 60 * 60 * 1000)))
   

    let weekstart = new Date(firstday.getTime())
    let weekend = new Date(firstday.getTime())
    weekend.setDate(weekend.getDate() + days)
    for(let i = 0; i < (diffDays/days) + 1; i++) {

      let week = {
        start: new Date(weekstart.getTime()),
        end: new Date(weekend.getTime()),
        visits: this.selectedLocation.visits.filter(visit => weekstart.getTime() < new Date(visit.date).getTime() && weekend.getTime() >= new Date(visit.date).getTime()),
        newOutlets: this.selectedLocation.newOutlets.filter(outlet => weekstart.getTime() < new Date(outlet.created).getTime() && weekend.getTime() >= new Date(outlet.created).getTime()),
        products: [],
        posms: [],
        giveaways: [],
        sales: [],
      }

      week.posms = this.selectedLocation.posms.map(posm => {
        posm = JSON.parse(JSON.stringify(posm))
        posm.added = 0;
        posm.removed = 0;
        return posm;
      });
  
      week.products = this.selectedLocation.products.map(product => {
        product = JSON.parse(JSON.stringify(product))
        product.stock = 0;
        product.visible = 0;
        product.invisible = 0;
        product.sold = 0;
        product.soldPrice = 0;
        product.ordered = 0;
        product.orderedPrice = 0;
        return product;
      });

  
      week.giveaways = this.selectedLocation.giveaways.map(giveaway => {
        giveaway = JSON.parse(JSON.stringify(giveaway))
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

          let ps =  visit.products.filter(product => prdt.skus.map(sku => sku._id).includes(product.sku))
          for (const p of ps) {
            prdt.stock += parseInt(p.stock);
            prdt.visible += p.visible ? 1 : 0;
            prdt.invisible += p.visible ? 0 : 1;
          }
          
          for (const sale of visit.sales) {
            let is =  sale.items.filter(item => prdt.skus.map(sku => sku._id).includes(item.sku))
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


      periods.push(week);
      weekstart.setDate(weekstart.getDate() + days);
      weekend.setDate(weekend.getDate() + days)
      
    }
    return periods;
  }

  drawGraph() {

   
   
    this.visitsGraph = {
      data: [
        {data: this.weeks && this.weeks.length ? this.weeks.map(week => week.visits.length) : [], label: 'Visits' },
        // {data: this.weeks && this.weeks.length ? this.weeks.map(week => week.newOutlets.length) : [], label: 'New Outlets'  },
      ],
      labels: this.weeks && this.weeks.length ? this.weeks.map(week => this.getYYYYMMDD(week.start)) : []
    }
    
    this.posmsAddedGraph = {
      data:  this.weeks && this.weeks.length ? this.selectedLocation.posms.map((posmm, index) => {
        return {
          data:this.weeks.map(week => {
            return week.posms.filter(posm => posm._id == posmm._id)[0].added
          }),
          label: posmm.name,
          //stack: String.fromCharCode(97 + index)
          stack: 'a'
        }
      }): [],
      labels: this.weeks && this.weeks.length ? this.weeks.map(week => this.getYYYYMMDD(week.start)) : []
    }

    this.posmsRemovedGraph = {
      data:  this.weeks && this.weeks.length ? this.selectedLocation.posms.map((posmm, index)  => {
        return {
          data:this.weeks.map(week => {
            return week.posms.filter(posm => posm._id == posmm._id)[0].removed
          }),
          label: posmm.name,
          //stack: String.fromCharCode(97 + index)
          stack: 'a'
        }
      }): [],
      labels: this.weeks && this.weeks.length ? this.weeks.map(week => this.getYYYYMMDD(week.start)) : []
    }



    this.giveawaysGraph = {
      data:  this.weeks && this.weeks.length ? this.selectedLocation.giveaways.map( giveawaym => {
        return {
          data:this.weeks.map(week => {
            return week.giveaways.filter(giveaway => giveaway._id == giveawaym._id)[0].amount
          }),
          label: giveawaym.name
        }
      }): [],
      labels: this.weeks && this.weeks.length ? this.weeks.map(week => this.getYYYYMMDD(week.start)) : []
    }

  


    let ordersData = this.weeks && this.weeks.length ? this.selectedLocation.products.map((productm, index) => {

      return {
        data:this.weeks.map(week => {
          return week.products.filter(product => product._id == productm._id)[0].ordered
        }),
        label: productm.name + " sales", 
        stack: String.fromCharCode(65 + index)
      }
    }): [];

    let salesData = this.weeks && this.weeks.length ? this.selectedLocation.products.map((productm, index) => {

      return {
        data:this.weeks.map(week => {
          return week.products.filter(product => product._id == productm._id)[0].sold
        }),
        label: productm.name + " orders", 
        stack: String.fromCharCode(65 + index)
      }

    }): [];

    let productData = salesData.concat(ordersData);


    this.salesGraph = {
      data: productData,
      labels: this.weeks && this.weeks.length ? this.weeks.map(week => this.getYYYYMMDD(week.start)) : []
    }

    let ordersClassificationData = this.weeks && this.weeks.length ? this.selectedLocation.products.map((productm, index) => {
      return {
        data:this.selectedLocation.classifications.map(classification => {
          return classification.products.filter(product => product._id == productm._id)[0].ordered
        }),
        label: productm.name + " sales", 
        stack: String.fromCharCode(65 + index)
      }
    }): [];

    let salesClassificationData = this.selectedLocation.classifications && this.selectedLocation.classifications.length ? this.selectedLocation.products.map((productm, index) => {

      return {
        data:this.selectedLocation.classifications.map(classification => {
          return classification.products.filter(product => product._id == productm._id)[0].sold
        }),
        label: productm.name + " orders", 
        stack: String.fromCharCode(65 + index)
      }

    }): [];

    let productClassificationData = salesClassificationData.concat(ordersClassificationData);

    this.productClassificationGraph = {
      data:  productClassificationData,
      labels: this.selectedLocation.classifications && this.selectedLocation.classifications.length ? this.selectedLocation.classifications.map(classification => classification.name) : []
    }

    this.visitsChart = {
      data: this.selectedLocation && this.selectedLocation.children ? this.selectedLocation.children.map(child => child.visits ? child.visits.length : 0 ):[],
      label: this.selectedLocation && this.selectedLocation.children ? this.selectedLocation.children.map(child => child.name):[]
    }

    this.newOutletsChart = {
      data: this.selectedLocation && this.selectedLocation.children ? this.selectedLocation.children.map(child => child.newOutlets ? child.newOutlets.length : 0 ):[],
      label: this.selectedLocation && this.selectedLocation.children ? this.selectedLocation.children.map(child => child.name):[]
    }

    if(this.selectedLocation) {
      this.selectedLocation.posms.map(posm => {
        posm.chartData = [[1],[1]]
        posm.chartLabel = ['loading']

        if(this.selectedLocation.children) {
          posm.chartData = [
            this.selectedLocation.children.map(child => {return child.posms.filter(posmm => posm._id == posmm._id)[0].added }),
            this.selectedLocation.children.map(child => {return child.posms.filter(posmm => posm._id == posmm._id)[0].removed })
          ]
          posm.chartLabel = this.selectedLocation.children.map(child => {
            return child.name
          })
        }
        return posm;
      })

      this.selectedLocation.giveaways.map(giveaway => {
        giveaway.chartData = [1]
        giveaway.chartLabel = ['loading']
        if(this.selectedLocation.children) {
          giveaway.chartData = this.selectedLocation.children.map(child => {return child.giveaways.filter(giveawaym => giveaway._id == giveawaym._id)[0].amount }),
          giveaway.chartLabel = this.selectedLocation.children.map(child => {
            return child.name
          })
        }
        return giveaway;
      })

      this.selectedLocation.products.map(product => {
        product.chartData = [[1],[1]]
        product.chartLabel = ['loading']
        if(this.selectedLocation.children) {
          product.chartData = [
            this.selectedLocation.children.map(child => {return child.products.filter(productm => product._id == productm._id)[0].sold }),
            this.selectedLocation.children.map(child => {return child.products.filter(productm => product._id == productm._id)[0].ordered })
          ]
          product.chartLabel = this.selectedLocation.children.map(child => {
            return child.name
          })
        }
        return product;
      })


    }



  }

  getYYYYMMDD(d0) {
    const d = new Date(d0)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  filterVisits() {

  }

  refreshChart() {

  }

  selectRegion(region){
    if(region != null) {
      this.selectedLRegion = region;
      this.selectedLocation = region;
      this.selectedLocation.children = this.selectedLocation.districts;
      this.selectedLocationType = 'region';
      this.selectedChildrenType = 'district';
      this.regionModel = region;
      this.districtModel = null;
      this.wardModel = null;
      this.filteredDistricts = region.districts ;
    } else {
      this.selectedLocation = this.all;
      this.selectedLocation.children = this.regions;
      this.selectedLocationType = 'country';
      this.selectedChildrenType = 'region';
      this.regionModel = null;
      this.districtModel = null;
      this.wardModel = null;
    }
    this.setServiceFilters();
  }

  selectDistrict(district){
    if(district != null) {
      this.selectedDistrict = district;
      this.selectedLocation = district;
      this.selectedLocation.children = this.selectedLocation.wards;
      this.selectedLocationType = 'district';
      this.selectedChildrenType = 'ward';
      this.districtModel =  district;
      this.wardModel = null;
      this.filteredWards = district.wards;
    } else {
      this.selectedLocation = this.selectRegion;
      this.selectedLocation.children = this.selectedLocation.districts;
      this.selectedLocationType = 'region';
      this.selectedChildrenType = 'district';
      this.districtModel = null;
      this.wardModel = null;
    }
    this.setServiceFilters();
  }

  selectWard(ward){
    if(ward != null) {
      this.selectedLocation = ward;
      this.selectedLocationType = 'ward';
      this.selectedLocation.children = []
      this.wardModel = ward;
      this.selectedChildrenType = null;
    } else {
      this.selectedLocation = this.selectedDistrict;
      this.selectedLocation.children = this.selectedLocation.wards;
      this.selectedLocationType = 'district';
      this.selectedChildrenType = 'ward';
      this.wardModel = null;
    }
    this.setServiceFilters();
  }

  setServiceFilters() {

    // this.projectService.setFilterVariables({
    //   regionModel : this.regionModel,
    //   districtModel : this.districtModel,
    //   wardModel : this.wardModel,
    //   categoryModel : this.categoryModel,
    //   query : this.queryModel == "" ? null : this.queryModel,
    // });
    this.weeks = this.visitsToDays(7)
    this.drawGraph()
  }

 




}
