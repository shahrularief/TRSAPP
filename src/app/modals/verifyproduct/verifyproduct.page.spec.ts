import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyproductPage } from './verifyproduct.page';

describe('VerifyproductPage', () => {
  let component: VerifyproductPage;
  let fixture: ComponentFixture<VerifyproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
