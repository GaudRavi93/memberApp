import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaPage } from './pa.page';

describe('PaPage', () => {
  let component: PaPage;
  let fixture: ComponentFixture<PaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
