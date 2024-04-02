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
import { of } from 'rxjs';
import { MockHostService } from 'src/testing/host.service.mock';
import { HostService } from 'src/app/hosts/host.service';
import { TaskEditComponent } from './task-edit.component';




describe('TaskEditComponent', () => {
  let taskEditComponent: TaskEditComponent;
  let taskForm: FormGroup;
  let mockHostService: { getTaskById: jasmine.Spy };
  mockHostService = jasmine.createSpyObj('HostService', ['getTaskById']);
  mockHostService.getTaskById.and.returnValue(of(MockHostService.testCompleteHunts[0]));
  let fixture: ComponentFixture<TaskEditComponent>;
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
        TaskEditComponent
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
    fixture = TestBed.createComponent(TaskEditComponent);
    taskEditComponent = fixture.componentInstance;
    fixture.detectChanges();
    taskForm = taskEditComponent.taskForm;
    expect(taskForm).toBeDefined();
    expect(taskForm.controls).toBeDefined();
    taskEditComponent.ngOnInit();
  });

  it('should create the component and form', () => {
    expect(taskEditComponent).toBeTruthy();
    expect(taskForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(taskForm.valid).toBeFalsy();
  });

  it('form should be invalid when empty', () => {
    expect(taskForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = taskEditComponent.taskForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should allow non-empty names', () => {
      nameControl.setValue('Chris');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('t'.repeat(300));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof taskEditComponent.editTaskValidationMessages = 'name';
      taskEditComponent.taskForm.get(controlName).setErrors({'required': true});
      expect(taskEditComponent.getErrorMessage(controlName)).toEqual('Task Name is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof taskEditComponent.editTaskValidationMessages = 'name';
      taskEditComponent.taskForm.get(controlName).setErrors({'unknown': true});
      expect(taskEditComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
  describe('onSubmit()', () => {
    it('should submit the form', () => {
      taskEditComponent.taskForm.setValue({
        name: "Frans Hunt",
        huntId: "fran_id"
      });

      taskEditComponent.onSubmit();
      expect(taskEditComponent.taskForm.valid).toBeTruthy();
    });
  });

});