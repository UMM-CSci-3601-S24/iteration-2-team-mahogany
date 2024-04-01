import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MockHostService } from 'src/testing/host.service.mock';
import { HostService } from 'src/app/hosts/host.service';
import { HuntProfileComponent } from '../hunt-profile.component';
import { HuntEditComponent } from './hunt-edit.component';
import { input } from '@angular/core';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';



describe('HuntEditComponent', () => {
  let huntEditComponent: HuntEditComponent;
  let huntForm: FormGroup;
  const mockHostService = new MockHostService();
  let fixture: ComponentFixture<HuntEditComponent>;
  const huntId = 'hunt_id';
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    getHunts: () => of(MockHostService.testHunts),
  });
  

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HuntEditComponent
      ],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: chrisId })
            }
          }
        }
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntEditComponent);
    huntEditComponent = fixture.componentInstance;
    fixture.detectChanges();
    huntForm = huntEditComponent.huntForm;
    expect(huntForm).toBeDefined();
    expect(huntForm.controls).toBeDefined();
    activatedRoute.setParamMap({ activatedRoute });
  });

  it('should create the component and form', () => {
    expect(huntEditComponent).toBeTruthy();
    expect(huntForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(huntForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = huntEditComponent.huntForm.controls.name;
      activatedRoute.setParamMap({ id: chrisId});
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "The Best Task"', () => {
      nameControl.setValue('The Best Task');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('t'.repeat(300));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the task', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should have `null` for the hunt for a bad ID', () => {
      activatedRoute.setParamMap({ id: 'badID' });
      expect(huntEditComponent.completeHunt).toBeUndefined();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'required': true});
      expect(huntEditComponent.getErrorMessage(controlName)).toEqual('Hunt Name is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'unknown': true});
      expect(huntEditComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});
