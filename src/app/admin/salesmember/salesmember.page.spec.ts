import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmemberPage } from './salesmember.page';

describe('SalesmemberPage', () => {
  let component: SalesmemberPage;
  let fixture: ComponentFixture<SalesmemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmemberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
