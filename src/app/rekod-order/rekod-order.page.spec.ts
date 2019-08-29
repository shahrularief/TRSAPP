import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekodOrderPage } from './rekod-order.page';

describe('RekodOrderPage', () => {
  let component: RekodOrderPage;
  let fixture: ComponentFixture<RekodOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekodOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekodOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
