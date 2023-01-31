import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { HeaderService } from '../_services/header.service';
import { Router } from '@angular/router';
import { OutletsService } from '../_services/outlets.service';
import { MatDialog } from '@angular/material/dialog';
import { RestApiService } from '../_services/rest-api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {


  outletObservarable: any;
  outlets: any[] = [];
  markers = []

  d = new Date();
  hh = ('0' + Math.abs((this.d.getTimezoneOffset() - (this.d.getTimezoneOffset() % 60)) / 60)).slice(-2);
  mm = ('0' +  Math.abs(this.d.getTimezoneOffset() % 60)).slice(-2);
  tz = this.d.getTimezoneOffset() > 0 ? '-' + this.hh + this.mm : '+' + this.hh + this.mm;

  position = { lat: -6.8041, lng: 39.2796 };

  loading: boolean = true;
  pages: number[] = [0];
  page: number = 0;
  filteredOutlets: any[] = [];
  length: number = 0;
  filteredLength: number = 0;
  offset: number = 0;
  limit: number  = 0;
  paginationSliceStart: number = 0;
  paginationSliceEnd: number = 6;
  paginationPages: number[] = [];

  regionModel: any = null;
  districtModel: any = null;
  wardModel: any = null;
  queryModel = null;


  regions = [];
  districts = [];
  wards = [];
  filteredDistricts = [];
  filteredWards = [];

  classificationModel = null;
  categoryModel: any;
  categories: any[];
  classifications: any[];
  user: any;



  constructor(
    private auth: AuthenticationService,
    private headerService: HeaderService,
    private outletService: OutletsService,
    private router: Router,
    public dialog: MatDialog,
    private restApi: RestApiService,
  ) {
    headerService.setPage('map');

    this.auth.isLoggedIn()
    .then((data: any) => {

      this.user = data;
      if(this.user.type == "temp") {
        router.navigate(['/no-access']);
      } else if(this.user.type == "client") {
        router.navigate(['/project']);
      }

    })
    .catch(err => {
      this.router.navigate(['/auth']);
    });

    navigator.geolocation.getCurrentPosition(function(location) {
      this.position = { lat: location.coords.latitude, lng: location.coords.longitude }
    })


    this.outletService.getData();
    this.outletObservarable = outletService.getDataObservable();
    this.outletObservarable.subscribe(arg => {

      //this.outlets = arg.outlets;
      this.regionModel = arg.regionModel;
      this.districtModel = arg.districtModel;
      this.wardModel = arg.wardModel;
      this.classifications = arg.classifications;


      this.outlets = arg.filteredOutletsUnpaginated;
      // this.outlets = arg.outlets;
      if(arg.outlets) {
        this.initMap()
      }

    });

    this.loadLocations();
  }

  initMap(): void {


      const map = new google.maps.Map(document.getElementById("map2") as HTMLElement, {
        center: this.position,
        zoom: 10,
      });

      this.markers = [];

      function HTMLMarker(lat,lng, name){
        this.lat = lat;
        this.lng = lng;
        this.pos = new google.maps.LatLng(lat,lng);
        this.name = name
      }




      /**
       * The custom USGSOverlay object contains the USGS image,
       * the bounds of the image, and a reference to the map.
       */
      class USGSOverlay extends google.maps.OverlayView {
        private bounds: google.maps.LatLngBounds;
        private name: string;
        private color: string;
        private div?: HTMLElement;

        constructor(bounds: google.maps.LatLngBounds, name: string, color: string) {
          super();

          this.bounds = bounds;
          this.name = name;
          this.color = color;
        }

        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
          this.div = document.createElement("div");
          this.div.className = "html-marker";
          this.div.style.borderStyle = "none";
          this.div.style.borderWidth = "0px";
          this.div.style.position = "absolute";


          this.div.innerHTML = "<div class='html-marker-label' ><span class=\"color\" style=\"background: " + this.color + " !important\"></span>" + this.name + "</div>";
          // Add the element to the "overlayLayer" pane.
          const panes = this.getPanes()!;
          panes.overlayLayer.appendChild(this.div);

        }

        draw() {
          // We use the south-west and north-east
          // coordinates of the overlay to peg it to the correct position and size.
          // To do this, we need to retrieve the projection from the overlay.
          const overlayProjection = this.getProjection();

          // Retrieve the south-west and north-east coordinates of this overlay
          // in LatLngs and convert them to pixel coordinates.
          // We'll use these coordinates to resize the div.
          const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getSouthWest()
          )!;
          const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getNorthEast()
          )!;

          // Resize the image's div to fit the indicated dimensions.
          if (this.div) {

            this.div.style.left = sw.x + "px";
            this.div.style.top = (ne.y - 35) + "px";
            this.div.style.display = "inline-block"
            //this.div.style.width = ne.x - sw.x + "px";
            //this.div.style.height = sw.y - ne.y + "px";
          }
        }

        /**
         * The onRemove() method will be called automatically from the API if
         * we ever set the overlay's map property to 'null'.
         */
        onRemove() {
          if (this.div) {
            (this.div.parentNode as HTMLElement).removeChild(this.div);
            delete this.div;
          }
        }

        /**
         *  Set the visibility to 'hidden' or 'visible'.
         */
        hide() {
          if (this.div) {
            this.div.style.visibility = "hidden";
          }
        }

        show() {
          if (this.div) {
            this.div.style.visibility = "visible";
          }
        }

        toggle() {
          if (this.div) {
            if (this.div.style.visibility === "hidden") {
              this.show();
            } else {
              this.hide();
            }
          }
        }

        toggleDOM(map: google.maps.Map) {
          if (this.getMap()) {
            this.setMap(null);
          } else {
            this.setMap(map);
          }
        }
      }

      for (const outlet of this.outlets) {

        // new google.maps.Marker({
        //   position: new google.maps.LatLng(outlet.latlng.lat,outlet.latlng.lng),
        //   map,
        //   title: outlet.name,
        // });

        // const bounds = new google.maps.LatLngBounds(
        //   new google.maps.LatLng(62.281819, -150.287132),
        //   new google.maps.LatLng(62.400471, -150.005608)
        // );

        const bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(parseFloat(outlet.latlng.lat) , parseFloat(outlet.latlng.lng) ),
          new google.maps.LatLng(parseFloat(outlet.latlng.lat) , parseFloat(outlet.latlng.lng) )
        );


        const overlay: USGSOverlay = new USGSOverlay(bounds, outlet.name, outlet.classifications.length ? outlet.classifications[0].color : '#000000');
        overlay.setMap(map);
        this.markers.push(overlay)

      }

      // Add a marker clusterer to manage the markers.
      // @ts-ignore MarkerClusterer defined via script
      // new MarkerClusterer(map, this.markers, {
      //   imagePath:
      //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      // });



  }

  ngOnInit(): void {

  }

  loadLocations() {

    this.restApi.getAuth('assets/regions')
    .then((data: any[]) => {
      this.regions = data;
    })
    .catch(err => {

    });

    this.restApi.getAuth('assets/districts')
    .then((data: any[]) => {
      this.districts = data;
    })
    .catch(err => {

    });

    this.restApi.getAuth('assets/wards')
    .then((data: any[]) => {
      this.wards = data;
    })
    .catch(err => {

    });

  }



  selectRegion(region){
    this.regionModel = region;
    this.districtModel = null;
    this.wardModel = null;
    this.filteredDistricts = region != null ? this.districts.filter(district => district.region == region._id) : this.districts ;
    this.setServiceFilters();
  }

  selectDistrict(district){
    this.districtModel = district;
    this.wardModel = null;
    this.filteredWards = this.wards.filter(ward => ward.district == district._id)
    this.setServiceFilters();
  }

  selectWard(ward){
    this.wardModel = ward;
    this.setServiceFilters();
  }

  selectCategory(category){
    this.categoryModel = category;
    this.setServiceFilters();
  }

  setServiceFilters() {
    this.outletService.setFilterVariables({
      regionModel : this.regionModel,
      districtModel : this.districtModel,
      wardModel : this.wardModel,
      categoryModel : this.categoryModel,
      query : this.queryModel == "" ? null : this.queryModel,
    });
  }

}
