import { Injectable } from "@angular/core";
import { RestApiService } from "./rest-api.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClassificationService {
  classifications: any[] = [];
  categories: any[] = [];

  type = "outlet";

  classificationObject: any = {
    type: this.type,
    levels: [],
    classifications: [],
    selectedClassification: { _id: null },
  };

  private dataSource = new Subject();
  selectedClass: any;

  constructor(public restApi: RestApiService, public router: Router) {
    this.fetch();
  }

  getDataObservable() {
    return this.dataSource;
  }

  sendData() {
    this.dataSource.next(this.classificationObject);
  }

  fetch() {
    Promise.all([
      this.restApi.getAuth("classification/classifications"),
      this.restApi.getAuth("classification/categories"),
    ])
      .then((data: any) => {
        if (this.type == "outlet") {
          this.classifications = data[0].filter(
            (classification) =>
              classification.for == this.type || classification.for == null
          );
          this.categories = data[1].filter(
            (category) => category.for == this.type || category.for == null
          );
        } else {
          this.classifications = data[0].filter(
            (classification) => classification.for == this.type
          );
          this.categories = data[1].filter(
            (category) => category.for == this.type
          );
        }
        this.organise();
        this.selectClass(null);
        return this.classificationObject;
      })
      .catch((error) => {
        console.log("error getting classification.", error);
      });
  }

  selectType(type) {
    this.classificationObject.type = type;
    this.type = type;
    this.sendData();
    this.fetch();
  }

  organise() {
    this.classificationObject.classifications = this.classifications.filter(
      (classification) => classification.category == null
    );
    for (const classification of this.classificationObject.classifications) {
      classification.categories = this.childCategories(classification);
      classification.children = classification.categories;
      classification.type = "classification";
    }
  }

  childCategories(classification) {
    const categories = this.categories.filter(
      (category) => category.classification === classification._id
    );
    if (categories) {
      classification.categories = categories;
      for (const category of classification.categories) {
        category.classifications = this.childClasses(category);
      }
      classification.children = classification.categories;
      classification.type = "classification";
    }
    classification.categories = categories;
    return categories;
  }

  childClasses(category) {
    const classifications = this.classifications.filter(
      (classification) => classification.category === category._id
    );
    if (classifications) {
      category.classifications = classifications;
      for (const classification of classifications) {
        classification.categories = this.childCategories(classification);
      }
      category.children = category.classifications;
      category.type = "category";
    }
  }

  selectClass(classification) {
    this.classificationObject.selectedClassification = classification
      ? classification
      : { _id: null, name: "" };
    this.selectedClass = classification;
    this.classificationObject.levels = [];
    if (classification == null) {
      this.classificationObject.levels.unshift({
        parent: {
          _id: null,
          name: "Classifications",
        },
        categories: [
          {
            _id: null,
            name: "Main Classes",
            classifications: this.classifications.filter(
              (classs) => classs.category == null
            ),
          },
        ],
      });
    } else {
      let currentClass = classification;
      while (true) {
        this.classificationObject.levels.unshift({
          parent: currentClass,
          categories: this.getChildren(currentClass),
        });

        if (currentClass.category == null) {
          this.classificationObject.levels.unshift({
            parent: {
              _id: null,
              name: "Classifications",
            },
            categories: [
              {
                name: "Main Classes",
                active: true,
                type: "category",
                classifications: this.classifications.filter(
                  (classs) =>
                    classs.category == null || classs.category == undefined
                ),
              },
            ],
            children: [
              {
                name: "Main Classes",
                active: true,
                type: "category",
                classifications: this.classifications.filter(
                  (classs) =>
                    classs.category == null || classs.category == undefined
                ),
              },
            ],
          });
          break;
        } else {
          const currentClassCategory = this.categories.filter(
            (category) => category._id === currentClass.category
          )[0];
          currentClass = this.classifications.filter(
            (classifications) =>
              classifications._id === currentClassCategory.classification
          )[0];
        }
      }
    }
    this.markActive();
    this.sendData();
  }

  getChildren(classification): any[] {

    const categories = this.categories.filter(
      (category) => category.classification === classification._id
    );
    for (const category of categories) {
      category.classifications = this.classifications.filter(
        (classs) => classs.category === category._id
      );
      category.children = category.classifications;
    }
    return categories;
  }

  markActive() {
    if (this.classificationObject.levels.length > 1) {
      for (let i = this.classificationObject.levels.length - 2; i >= 0; i--) {

        for (const category of this.classificationObject.levels[i].categories) {
          category.active = false;
          for (const classification of category.classifications) {
            classification.active = false;
            if (
              classification._id ===
              this.classificationObject.levels[i + 1].parent._id
            ) {
              classification.active = true;
              category.active = true;
            }
          }
        }
      }
    }
  }

  createClass(name, categoryId) {
    this.restApi
      .postAuth("classification/classification/create", {
        name,
        category: categoryId,
        for: this.type,
      })
      .then((data) => {
        this.classifications.push(data);
        this.selectClass(data);
      })
      .catch((err) => {});
  }

  createCategory(name, classificationId) {
    this.restApi
      .postAuth("classification/category/create", {
        name: name,
        classification: classificationId,
        for: this.type,
      })
      .then((data) => {
        this.categories.push(data);
        this.selectClass(this.selectedClass);
      })
      .catch((err) => {});
  }

  deleteClass(classification: any) {
    this.restApi
      .deleteAuth("classification/classification/" + classification._id)
      .then((data) => {
        this.classifications.splice(
          this.classifications.indexOf(classification),
          1
        );
        if (
          this.selectedClass &&
          this.selectedClass._id === classification._id
        ) {
          if (this.selectedClass.category) {
            const currentClassCategory = this.categories.filter(
              (category) => category._id === this.selectedClass.category
            )[0];
            const currentClass = this.classifications.filter(
              (classifications) =>
                classifications._id === currentClassCategory.classification
            )[0];
            this.selectClass(currentClass);
          } else {
            this.selectClass(null);
          }
        } else {
          this.selectClass(this.selectedClass);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteCategory(category: any) {
    this.restApi
      .deleteAuth("classification/category/" + category._id)
      .then((data) => {
        this.categories.splice(this.categories.indexOf(category), 1);
        if (this.selectedClass.category === category._id) {
          this.selectClass(
            this.classifications.filter(
              (classs) => classs._id === category.classification
            )[0]
          );
        } else {
          this.selectClass(this.selectedClass);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
