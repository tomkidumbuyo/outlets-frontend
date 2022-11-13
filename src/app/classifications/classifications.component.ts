import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { HeaderService } from '../_services/header.service';
import { Router } from '@angular/router';
import { RestApiService } from '../_services/rest-api.service';
import { ClassificationService } from '../_services/classification.service';
import { Subject } from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { FormBuilder } from '@angular/forms';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}


@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.scss']
})
export class ClassificationsComponent implements OnInit {



  classificationObservarable: any;
  levels: any[];
  displayLevels: any[];
  display = 'bar';
  selectedClassification = {_id: null, name:"", attributes: []};

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  attributeForm: any;

  type = 'outlet';
  page = 'classification'
  newPosm = '';
  newGiveaway = '';

  posms = [];
  giveaways = [];

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  newAttribute: { name: string; type: string; unit: string; };
  user: any;


  constructor(
    private auth: AuthenticationService,
    private headerService: HeaderService,
    private router: Router,
    private restApi: RestApiService,
    private classificationService: ClassificationService,
    private formBuilder: FormBuilder,
  ) {

    this.auth.isLoggedIn()
    .then((data: any) => {
      this.user = data;
      console.log(this.user)
      if(this.user.type == "temp") {
        router.navigate(['/no-access']);
      } else if(this.user.type == "client") {
        router.navigate(['/project']);
      }
    })
    .catch(err => {
      this.router.navigate(['/auth']);
      console.log('Error getting user.');
    });

    this.newAttribute = {
      name: '',
      type: 'number',
      unit: ''
    }

    this.headerService.setPage('classification');

    this.classificationObservarable = this.classificationService.getDataObservable();
    this.classificationObservarable.subscribe(arg => {
      console.log('args',arg);
      this.levels = arg.levels;
      this.dataSource.data = arg.classifications;
      this.displayLevels = this.levels.slice(-4);
      this.selectedClassification = arg.selectedClassification;
      this.type = arg.type;
    });
    this.classificationService.selectClass(null);

  }

  ngOnInit(): void {

    this.restApi.getAuth('posm/')
    .then((data: any) => {
        console.log(data);
        this.posms = data;
    })
      .catch(err => {
        console.log(err);
    })

    this.restApi.getAuth('giveaway/')
    .then((data: any) => {
        console.log(data);
        this.giveaways = data;
    })
    .catch(err => {
        console.log(err);
    })

    


  }

  selectType(type) {
    if(type == 'posm') {
      this.page = "posm";
    } else {
      this.page = "classification";
      this.classificationService.selectType(type);
    }

  }

  selectClass(classification) {
    if (classification.type == null || classification.type == 'classification') {
      this.classificationService.selectClass(classification);
    }
  }

  createCategory(level) {
    this.classificationService.createCategory(level.newCategoryName, level.parent._id);
  }

  createClass(category) {
    this.classificationService.createClass(category.newClassName, category._id);
  }

  deleteCategory(category) {
    this.classificationService.deleteCategory(category);
  }

  deleteClass(classification) {
    this.classificationService.deleteClass(classification);
  }

  changeDisplay(display) {
    this.display = display;
  }

  deleteAttribute(attribute) {
    console.log(this.selectedClassification.attributes.indexOf(attribute))
    this.selectedClassification.attributes.splice(this.selectedClassification.attributes.indexOf(attribute), 1);
    console.log(this.selectedClassification.attributes)
    this.restApi.putAuth('classification/classification/' + this.selectedClassification._id, this.selectedClassification)
    .then(data => {
      this.classificationService.selectClass(this.selectedClassification);
    })
    .catch(err => {
      console.log(err);
    })
  }


  addAttribute() {
    console.log(this.newAttribute);
    if (this.newAttribute.name == "") {
      console.log('Please add attribute name');
    } else {
      this.selectedClassification.attributes.push(JSON.parse(JSON.stringify(this.newAttribute)));
      this.restApi.putAuth('classification/classification/' + this.selectedClassification._id, this.selectedClassification)
      .then((data: any) => {
        console.log(data);
        this.selectedClassification = data;
        this.classificationService.selectClass(this.selectedClassification);
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  createPosm() {
    this.restApi.postAuth('posm/create', {name: this.newPosm})
    .then((data: any) => {
        console.log(data);
        this.posms.push(data);
    })
      .catch(err => {
        console.log(err);
    })
  }

  createGiveaway() {
    this.restApi.postAuth('giveaway/create', {name: this.newGiveaway})
    .then((data: any) => {
        console.log(data);
        this.giveaways.push(data);
    })
      .catch(err => {
        console.log(err);
    })
  }

  deletePosm(posm) {
    this.restApi.deleteAuth('posm/' + posm._id)
    .then((data: any) => {
        console.log(data);
        this.posms.splice(this.posms.indexOf(posm),1);
    })
      .catch(err => {
        console.log(err);
    })
  }

  deleteGiveaway(giveaway) {
    this.restApi.deleteAuth('giveaway/' + giveaway._id)
    .then((data: any) => {
        console.log(data);
        this.giveaways.splice(this.giveaways.indexOf(giveaway),1);
    })
      .catch(err => {
        console.log(err);
    })
  }

}
