import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecompPage } from './updatecomp.page';

describe('UpdatecompPage', () => {
  let component: UpdatecompPage;
  let fixture: ComponentFixture<UpdatecompPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecompPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecompPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
