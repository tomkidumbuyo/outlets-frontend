import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassificationsComponent } from './classifications.component';

describe('ClassificationsComponent', () => {
  let component: ClassificationsComponent;
  let fixture: ComponentFixture<ClassificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
