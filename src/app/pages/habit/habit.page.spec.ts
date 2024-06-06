import { HabitsPage } from './habit.page';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('HabitsPage', () => {
  let component: HabitsPage;
  let fixture: ComponentFixture<HabitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HabitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
