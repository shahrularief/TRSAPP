import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderPage } from './update-order.page';

describe('UpdateOrderPage', () => {
  let component: UpdateOrderPage;
  let fixture: ComponentFixture<UpdateOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
