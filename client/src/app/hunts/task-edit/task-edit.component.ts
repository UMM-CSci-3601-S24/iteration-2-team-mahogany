import { Component, input } from '@angular/core';
import { FormControl, FormBuilder, Validators} from '@angular/forms';
import { HostService } from 'src/app/hosts/host.service';
import { ReactiveFormsModule } from '@angular/forms'; // Move this import statement to the top of the file
import { MatFormFieldModule } from "@angular/material/form-field";


@Component ({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'], // Remove the comma here
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule] // Remove this line
})
export class TaskEditComponent {
  huntId = input.required<string>();
  taskEdit: boolean = false;

  taskForm = this.fb.group({
    huntId: new FormControl(),
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])),
  });

  readonly taskValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ],
  };

  constructor(
    private hostService: HostService,
    private fb: FormBuilder
  ) {}

  formControlHasError(controlName: string): boolean {
    return this.taskForm.get(controlName).invalid &&
      (this.taskForm.get(controlName).dirty || this.taskForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.taskValidationMessages): string {
    for(const {type, message} of this.taskValidationMessages[name]) {
      if (this.taskForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  
  onSubmit(): void {
    console.log('Form validity:', this.taskForm.valid);
    console.log('Form value:', this.taskForm.value);
  
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const huntId = formValue.huntId;
      this.hostService.editTask(huntId, formValue).subscribe(() => {
        this.taskEdit = false;
      }, error => {
        console.error('Error editing task:', error);
      });
    }
  }

  
}