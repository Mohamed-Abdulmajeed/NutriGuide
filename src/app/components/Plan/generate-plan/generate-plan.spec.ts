import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePlan } from './generate-plan';

describe('GeneratePlan', () => {
  let component: GeneratePlan;
  let fixture: ComponentFixture<GeneratePlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratePlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
