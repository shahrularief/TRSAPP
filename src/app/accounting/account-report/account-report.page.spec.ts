import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReportPage } from './account-report.page';

describe('AccountReportPage', () => {
  let component: AccountReportPage;
  let fixture: ComponentFixture<AccountReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
