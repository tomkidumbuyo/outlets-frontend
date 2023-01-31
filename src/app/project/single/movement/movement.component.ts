import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';

declare var $;

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent implements OnInit {

  projectDataObserver: any;
  dispatchs: any;



  selectedOutlet: any = null;
  region_page: any = 'Dc';
  outlet_page: any;

  regions: any[] = [];


  d = new Date();
  hh = ('0' + Math.abs((this.d.getTimezoneOffset() - (this.d.getTimezoneOffset() % 60)) / 60)).slice(-2);
  mm = ('0' +  Math.abs(this.d.getTimezoneOffset() % 60)).slice(-2);
  tz = this.d.getTimezoneOffset() > 0 ? '-' + this.hh + this.mm : '+' + this.hh + this.mm;

  loadingMessage = '';
  dataLoaded: boolean = false;

  regionModel: any = null;
  districtModel: any = null;
  wardModel: any = null;
  categoryModel: any = null;
  queryModel = null;

  filteredDistricts = [];
  filteredWards = [];
  all: any;
  selectedLocation: any;
  selectedLocationType: string;
  selectedRegion: any;
  selectedDistrict: any;
  selectedChildrenType: string;

  from;
  to;
  initialfrom;
  initialto;
  project: any;

  page = 'summary';
  selectedVisit: any;
  outlets: any;
  visits: any;
  popupImage: any;

  constructor(
    private projectService: ProjectService,
  ) {

    this.projectDataObserver = this.projectService.getDataObservable();
    this.projectDataObserver.subscribe(data => {

      this.loadingMessage = data.loadingMessage;
      this.dataLoaded     = data.dataLoaded;
      this.project        = data.project;
      this.all            = data.all;
      this.regions        = data.regions;
      this.outlets        = data.outlets;

      if(this.project) {
        if(this.from == null && this.to == null) {
          this.from = this.project.from;
          this.to = this.project.to
          this.initialfrom = this.project.from;
          this.initialto = this.project.to

          var d = new Date();
          this.to = d;
          this.initialto = d;
        }

      }
      if (this.dataLoaded && this.all) {
        this.all.name = "Tanzania";
        this.selectRegion(null);
      }
    });
    this.projectService.setPage('lidmovement');



  }

  ngOnInit() {

  }

  selectRegion(region){

    if(region != null) {
      this.selectedRegion = region;
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
      this.districtModel = district;
      this.wardModel = null;
      this.filteredWards = district.wards

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

    this.projectService.setFilterVariables({
      regionModel : this.regionModel,
      districtModel : this.districtModel,
      wardModel : this.wardModel,
      categoryModel : this.categoryModel,
      query : this.queryModel == "" ? null : this.queryModel,
    });


    this.visits = []
    for (const visit of this.selectedLocation.visits) {
      let vs = Object.assign({}, visit);
      vs.posms = this.project.posms.map(posm => {
        posm.added = 0;
        posm.removed = 0;
        return JSON.parse(JSON.stringify(posm));
      });

      vs.posms = vs.posms.map(posm =>  {
        let p =  visit.posms.filter(posmm => posmm.posm != null && posmm.posm._id == posm._id)
        if(p.length) {
          posm.added += parseInt(p[0].added);
          posm.removed += parseInt(p[0].removed);
        }
        return posm;
      });

    //   // vs.outlet = this.selectedLocation.outlets.filter(outlet => outlet._id == visit.outlet || outlet._id == visit.outlet._id)[0]
      for (const outlet of this.selectedLocation.outlets) {
          if(outlet._id == vs.outlet || outlet._id == vs.outlet._id) {
            vs.outlet = outlet;
          }
      }
      this.visits.push(vs);
    }

  }

  select_page(page) {
    this.page = page;
  }

  selectOutlet(outlet) {
    this.selectedOutlet = outlet;
    this.select_outlet_page('summary');
    if(this.selectedOutlet.visits != undefined && this.selectedOutlet.visits.length > 0) {
      this.select_visit(this.selectedOutlet.visits[0])
    } else {
      this.select_visit(null);
    }
  }


  select_outlet_page(page) {
    this.outlet_page = page;
  }

  timeChanged($event) {
    this.projectService.setTimeFilter(this.from,this.to)
  }

  resetTime() {
    this.from = this.initialfrom
    this.to = this.initialto
    this.projectService.setTimeFilter(this.from,this.to)
  }

  select_visit(visit) {
    this.selectedVisit = visit;
  }

  viewImage(image) {
    $('#imagemodal').modal('hide');
    this.popupImage = image
    $('#imagemodal').modal('show');
  }


}
