import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesbypersonPage } from './salesbyperson.page';

describe('SalesbypersonPage', () => {
  let component: SalesbypersonPage;
  let fixture: ComponentFixture<SalesbypersonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesbypersonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesbypersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
