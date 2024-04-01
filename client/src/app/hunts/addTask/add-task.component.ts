import { Component, input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HostService } from "src/app/hosts/host.service";

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule],
    providers: [HostService]
})
export class AddTaskComponent {

  huntId = input.required<string>();
  addTask: boolean = false;

  addTaskForm = new FormGroup({
    huntId: new FormControl(),
    status: new FormControl(),

    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])),
  });

  readonly addTaskValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ],
  };

  constructor(
    private hostService: HostService,
    private snackBar: MatSnackBar,) {
  }

  formControlHasError(controlName: string): boolean {
    return this.addTaskForm.get(controlName).invalid &&
      (this.addTaskForm.get(controlName).dirty || this.addTaskForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addTaskValidationMessages): string {
    for(const {type, message} of this.addTaskValidationMessages[name]) {
      if (this.addTaskForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.addTaskForm.value.huntId = this.huntId();
    this.addTaskForm.value.status = false;
    this.hostService.addTask(this.addTaskForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          `Added task ${this.addTaskForm.value.name}`,
          null,
          { duration: 2000 }
        );
        setTimeout(() => window.location.reload(), 2000);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}
