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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { MockHostService } from 'src/testing/host.service.mock';
import { HostService } from 'src/app/hosts/host.service';
import { HuntProfileComponent } from '../hunt-profile.component';
import { HuntEditComponent } from './hunt-edit.component';
import { input } from '@angular/core';


describe('HuntEditComponent', () => {
  let huntEditComponent: HuntEditComponent;
  let huntForm: FormGroup;
  let fixture: ComponentFixture<HuntEditComponent>;

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
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'required': true});
      expect(huntEditComponent.getErrorMessage(controlName)).toEqual('Name is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof huntEditComponent.editHuntValidationMessages = 'name';
      huntEditComponent.huntForm.get(controlName).setErrors({'unknown': true});
      expect(huntEditComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

describe('HuntEditComponent#submitForm()', () => {
  let component: HuntEditComponent;
  let fixture: ComponentFixture<HuntEditComponent>;
  let hostService: HostService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        HuntEditComponent, HuntProfileComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntEditComponent);
    component = fixture.componentInstance;
    hostService = TestBed.inject(HostService);
    location = TestBed.inject(Location);
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  // beforeEach(() => {
  //   component.huntForm.controls.name.setValue('Take a picture of a dog');
  //   component.huntForm.controls.huntId.setValue('1');
  //   component.huntId = input('1');
  // });

  // it('should call huntEdit() and handle error response', () => {
  //   const path = location.path();
  //   const errorResponse = { status: 500, message: 'Server error' };
  //   const huntEditSpy = spyOn(hostService, 'huntEdit')
  //     .and
  //     .returnValue(throwError(() => errorResponse));
  //   component.submitForm();
  //   expect(huntEditSpy).toHaveBeenCalledWith(component.huntForm.value);
  //   expect(location.path()).toBe(path);
  // });


  // it('should return true when the control is invalid and either dirty or touched', () => {
  //   const controlName = 'name';
  //   component.huntForm.get(controlName).setValue('');
  //   component.huntForm.get(controlName).markAsDirty();
  //   expect(component.formControlHasError(controlName)).toBeTruthy();
  // });

  // it('should return false when the control is valid', () => {
  //   const controlName = 'name';
  //   component.huntForm.get(controlName).setValue('Valid Name');
  //   expect(component.formControlHasError(controlName)).toBeFalsy();
  // });

  // it('should return false when the control is invalid but not dirty or touched', () => {
  //   const controlName = 'name';
  //   component.huntForm.get(controlName).setValue('');
  //   expect(component.formControlHasError(controlName)).toBeFalsy();
  // });

});

