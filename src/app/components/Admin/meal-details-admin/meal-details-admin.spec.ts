import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealDetailsAdmin } from './meal-details-admin';

describe('MealDetailsAdmin', () => {
  let component: MealDetailsAdmin;
  let fixture: ComponentFixture<MealDetailsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealDetailsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealDetailsAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
