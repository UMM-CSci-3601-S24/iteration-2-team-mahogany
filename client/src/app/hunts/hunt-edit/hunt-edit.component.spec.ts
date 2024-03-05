import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuntEditComponent } from './hunt-edit.component';

describe('HuntEditComponent', () => {
  let component: HuntEditComponent;
  let fixture: ComponentFixture<HuntEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuntEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HuntEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
