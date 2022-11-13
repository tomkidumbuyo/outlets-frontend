import { Component, OnInit } from '@angular/core';
import { TempService } from 'src/app/_services/temp.service';

declare var $: any

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {

  temp: any;
  tempObservarable: any;

  page = "false";
  id: any;
  days: any = [];
  report: any = {};
  selectedDay: any;
  datesDivLength = 0;
  datesDivListLength = 0;
  divLeft = 12
  selectedVisit: any;
  posms: any;
  project: any;
  giveaways: any;

  constructor(
    private tempService: TempService
  ) { 

    this.tempObservarable = this.tempService.getDataObservable();
    this.tempObservarable.subscribe(arg => {
      this.temp = arg.temp;
      if(arg.days && arg.days.length) {
        this.days = arg.days;
        this.report = arg.report;
        this.posms = arg.posms;
        this.project = arg.project;
        this.giveaways = arg.giveaways;
        if(!this.selectedDay) {
          this.selectDay(this.days[this.days.length - 1])
          setTimeout(() => { 
            this.datesDivLength = $('.dates-div').width()
            this.datesDivListLength = $('.dates-div-list').width()
            this.divLeft = this.datesDivLength > this.datesDivListLength ? 0 : (this.datesDivListLength - this.datesDivLength)*-1;
          }, 1000);
          
        }
      }
      console.log('ARG : ',arg)
    });
    this.tempService.setPage('visits');
    
  }

  ngOnInit(): void {

    
  }

  selectDay(day) {
    this.selectedDay = day;
    console.log('DAY : ',day)
    if(this.selectedDay.visits.length > 0 ) {
      this.selectVisit(this.selectedDay.visits[0]);
    }
  }

  selectVisit(visit) {
    this.selectedVisit = visit;
    console.log('visit', visit)

    this.selectedVisit.posms = this.project.posms.map(posm => {
      posm.added = 0;
      posm.removed = 0;
      return JSON.parse(JSON.stringify(posm));
    });

    this.selectedVisit.products = this.project.products.map(product => {
      product.stock = 0;
      product.visible = 0;
      product.invisible = 0;
      product.sold = 0;
      product.soldPrice = 0;
      product.ordered = 0;
      product.orderedPrice = 0;
      return JSON.parse(JSON.stringify(product));
    });

    this.selectedVisit.giveaways = this.project.giveaways.map(giveaway => {
      giveaway.amount = 0;
      return giveaway;
    });

    

      this.selectedVisit.posms = this.selectedVisit.posms.map(posm =>  {
          let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
          if(p.length) {
            posm.added += parseInt(p[0].added);
            posm.removed += parseInt(p[0].removed);
          }
          return posm;
      });
  
      this.selectedVisit.giveaways = this.selectedVisit.giveaways.map(giveaway =>  {
        let p =  visit.giveaways.filter(giveawaym => giveawaym.giveaway != null && giveawaym.giveaway._id == giveaway._id)
        if(p.length) {
          giveaway.amount += parseInt(p[0].amount);
        }
        return giveaway;
      });

      this.selectedVisit.products = this.selectedVisit.products.map(prdt => {

       
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

      console.log('this.selectedVisit', this.selectedVisit);

      
    
  }

  scrollLeft() {
    this.datesDivLength = $('.dates-div').width()
    this.datesDivListLength = $('.dates-div-list').width()
    if(this.divLeft < 0) {
      this.divLeft += 100;
    } else {
      this.divLeft = 0
    }
  }

  scrollRight() {
    this.datesDivLength = $('.dates-div').width()
    this.datesDivListLength = $('.dates-div-list').width()
    if(this.divLeft > (this.datesDivLength - this.datesDivListLength + 100)) {
      this.divLeft -= 100;
    } else {
      this.divLeft = (this.datesDivLength - this.datesDivListLength + 10)
    }
  }

}
