import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdProductPage } from './prod-product.page';

describe('ProdProductPage', () => {
  let component: ProdProductPage;
  let fixture: ComponentFixture<ProdProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
