import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserNotAllowedComponent } from './user-not-allowed.component';

describe('UserNotAllowedComponent', () => {
  let component: UserNotAllowedComponent;
  let fixture: ComponentFixture<UserNotAllowedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotAllowedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
