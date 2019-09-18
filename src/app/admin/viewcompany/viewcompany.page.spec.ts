import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcompanyPage } from './viewcompany.page';

describe('ViewcompanyPage', () => {
  let component: ViewcompanyPage;
  let fixture: ComponentFixture<ViewcompanyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcompanyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
