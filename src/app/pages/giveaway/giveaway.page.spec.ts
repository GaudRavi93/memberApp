import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiveawayPage } from './giveaway.page';

describe('GiveawayPage', () => {
  let component: GiveawayPage;
  let fixture: ComponentFixture<GiveawayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GiveawayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
