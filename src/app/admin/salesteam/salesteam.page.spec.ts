import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesteamPage } from './salesteam.page';

describe('SalesteamPage', () => {
  let component: SalesteamPage;
  let fixture: ComponentFixture<SalesteamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesteamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
