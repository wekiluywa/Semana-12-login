import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FansiteComponent } from './fansite';

describe('FansiteComponent', () => {
  let component: FansiteComponent;
  let fixture: ComponentFixture<FansiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FansiteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FansiteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});