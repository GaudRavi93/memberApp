import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestPage } from './rest.page';

describe('RestPage', () => {
  let component: RestPage;
  let fixture: ComponentFixture<RestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
