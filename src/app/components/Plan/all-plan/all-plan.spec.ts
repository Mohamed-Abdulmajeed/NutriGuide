import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPlan } from './all-plan';

describe('AllPlan', () => {
  let component: AllPlan;
  let fixture: ComponentFixture<AllPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
