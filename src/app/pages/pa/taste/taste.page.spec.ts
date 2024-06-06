import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TastePage } from './taste.page';

describe('TastePage', () => {
  let component: TastePage;
  let fixture: ComponentFixture<TastePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TastePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
