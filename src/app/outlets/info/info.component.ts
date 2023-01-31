import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/_services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

declare var $;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  outlet: any = {};

  page = "visits";
  sales: any[] = [];
  map: google.maps.Map;

  visits = []
  popupImage: any;

  d = new Date();
  hh = ('0' + Math.abs((this.d.getTimezoneOffset() - (this.d.getTimezoneOffset() % 60)) / 60)).slice(-2);
  mm = ('0' +  Math.abs(this.d.getTimezoneOffset() % 60)).slice(-2);
  tz = this.d.getTimezoneOffset() > 0 ? '-' + this.hh + this.mm : '+' + this.hh + this.mm;


  constructor(
    public restApi: RestApiService,
    private route: ActivatedRoute
  ) {
      this.restApi.getAuth('outlet/' + this.route.snapshot.params.id)
      .then(data => {
        this.outlet = data;
        this.getSales();
        this.initMap()

      })
      .catch(err => {
        console.log(err)
      })

      this.getVisit(this.route.snapshot.params.id);

  }

  initMap(): void {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: parseFloat(this.outlet.latlng.lat), lng: parseFloat(this.outlet.latlng.lng) },
      zoom: 12,
    });

    new google.maps.Marker({
          position: new google.maps.LatLng(this.outlet.latlng.lat,this.outlet.latlng.lng),
          map,
          title: this.outlet.name,
    });
  }

  ngOnInit(): void {
  }

  getSales() {
    this.restApi.getAuth('outlet/' + this.outlet._id + '/sales')
    .then((data: any[]) => {
        this.sales = data;
    })
    .catch(err => {
        console.log(err)
    })
  }

  getVisit(id) {
    this.restApi.getAuth('outlet/' + id + '/visits')
    .then((data: any[]) => {
        this.visits = data.map(visit => {
          visit.rowspan = Math.max(visit.posms.length,visit.giveaways.length, visit.sales.length);
          visit.rows = Array(visit.rowspan).fill(0).map((x,i)=>i)
          return visit;
        });
    })
    .catch(err => {
        console.log(err)
    })
  }

  selectPage(page) {
    this.page = page;
  }

  viewImage(image) {
    $('#imagemodal').modal('hide');
    this.popupImage = image
    $('#imagemodal').modal('show');
  }

}
