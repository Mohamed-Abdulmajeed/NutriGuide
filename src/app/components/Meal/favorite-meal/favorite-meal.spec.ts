import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteMeal } from './favorite-meal';

describe('FavoriteMeal', () => {
  let component: FavoriteMeal;
  let fixture: ComponentFixture<FavoriteMeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteMeal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteMeal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
