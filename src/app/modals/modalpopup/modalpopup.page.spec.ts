import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpopupPage } from './modalpopup.page';

describe('ModalpopupPage', () => {
  let component: ModalpopupPage;
  let fixture: ComponentFixture<ModalpopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalpopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalpopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
