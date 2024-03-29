import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentHuntComponent } from './current-hunt.component';

describe('CurrentHuntComponent', () => {
  let component: CurrentHuntComponent;
  let fixture: ComponentFixture<CurrentHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentHuntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
