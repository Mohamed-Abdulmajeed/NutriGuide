import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPlan } from './details-plan';

describe('DetailsPlan', () => {
  let component: DetailsPlan;
  let fixture: ComponentFixture<DetailsPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
