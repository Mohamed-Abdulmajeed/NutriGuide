import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMeal } from './generate-meal';

describe('GenerateMeal', () => {
  let component: GenerateMeal;
  let fixture: ComponentFixture<GenerateMeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateMeal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateMeal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
