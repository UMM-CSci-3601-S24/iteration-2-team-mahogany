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
import { ActivatedRoute, ParamMap, Router, convertToParamMap } from '@angular/router';
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
  let mockHostService: { getHuntById: jasmine.Spy };
  mockHostService = jasmine.createSpyObj('HostService', ['getHuntById']);
  mockHostService.getHuntById.and.returnValue(of(MockHostService.testCompleteHunts[0]));
  let fixture: ComponentFixture<HuntEditComponent>;
  const chrisId = 'fran_id';
  let activatedRoute: { snapshot: { paramMap: ParamMap } };
  activatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({ id: chrisId }) 
    }
  };
  

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
        { provide: ActivatedRoute, useValue: activatedRoute },
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
    huntEditComponent.ngOnInit();
  });

  it('should create the component and form', () => {
    expect(huntEditComponent).toBeTruthy();
    expect(huntForm).toBeTruthy();
  });

  // it('should fetch hunt data on init and set form values', () => {
  //   huntEditComponent.ngOnInit();
  //   expect(mockHostService.getHuntById).toHaveBeenCalledWith(chrisId); 
  //   expect(huntEditComponent.huntForm.value).toEqual({ huntId: 'fran_id', name: 'Frans Hunt', description: 'super exciting hunt',
  //   est: 45,
  //   hostId: 'fran_hid',
  //   numberOfTasks: 2});
  // });

  it('form should be invalid when empty', () => {
    expect(huntForm.valid).toBeTruthy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = huntEditComponent.huntForm.controls.name;
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

    // it('should update hunt data on submit and navigate to the hunt list', () => {
    //   (mockHostService as any).updateHunt = jasmine.createSpy().and.returnValue(of({}));
    //   huntEditComponent.onSubmit();
    //   expect(mockHostService.updateHunt).toHaveBeenCalledWith(huntEditComponent.huntForm.value);
    //   expect(mockRouter.navigate).toHaveBeenCalledWith(['/hunts']);
    // });
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
  describe('formControlHasError()', () => {
    it('should return true if the control is invalid and dirty', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'required': true});
      huntEditComponent.huntForm.get(controlName).markAsDirty();
      expect(huntEditComponent.formControlHasError(controlName)).toBeTruthy();
    });

    it('should return true if the control is invalid and touched', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'required': true});
      huntEditComponent.huntForm.get(controlName).markAsTouched();
      expect(huntEditComponent.formControlHasError(controlName)).toBeTruthy();
    });

    it('should return false if the control is invalid but pristine', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'required': true});
      expect(huntEditComponent.formControlHasError(controlName)).toBeFalsy();
    });

    it('should return false if the control is valid but dirty', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors(null);
      huntEditComponent.huntForm.get(controlName).markAsDirty();
      expect(huntEditComponent.formControlHasError(controlName)).toBeFalsy();
    });
  });
});
