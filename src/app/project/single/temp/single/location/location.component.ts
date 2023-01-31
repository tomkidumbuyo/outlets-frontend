import { Component, OnInit } from '@angular/core';
import { TempService } from 'src/app/_services/temp.service';

declare var $: any

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

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

  constructor(
    private tempService: TempService
  ) {

    this.tempObservarable = this.tempService.getDataObservable();
    this.tempObservarable.subscribe(arg => {
      this.temp = arg.temp;
      if(arg.days && arg.days.length) {
        this.days = arg.days;
        this.report = arg.report;
        if(!this.selectedDay) {
          this.selectDay(this.days[this.days.length - 1])
          setTimeout(() => {
            this.datesDivLength = $('.dates-div').width()
            this.datesDivListLength = $('.dates-div-list').width()
            this.divLeft = this.datesDivLength > this.datesDivListLength ? 0 : (this.datesDivListLength - this.datesDivLength)*-1;
            this.datesDivListLength = $('.dates-div-list').width()
          }, 1000);

        }
      }
    });

    this.tempService.setPage('location');

  }

  selectDay(day) {
    this.selectedDay = day;
    setTimeout(()=>{
      this.initMap();
    }, 1000);
  }

  ngOnInit(): void {

  }

  initMap(): void {

    let pos = { lat: parseFloat('0.00'), lng: parseFloat('0.00') }
    if(this.selectedDay.movements.length > 0) {
      pos = { lat: parseFloat(this.selectedDay.movements[0].lat), lng: parseFloat(this.selectedDay.movements[0].lng) }
    }

    const map = new google.maps.Map(document.getElementById("map-temp") as HTMLElement, {
      center: pos,
      zoom: 12,
    });

    var coords = [];
    var bounds = new google.maps.LatLngBounds();

    for (const movement of this.selectedDay.movements) {
      let coord = new google.maps.LatLng(parseFloat(movement.lat), parseFloat(movement.lng))
      bounds.extend(coord);
      coords.push(coord);
    }

    var line= new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    line.setMap(map);
    map.fitBounds(bounds);

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
