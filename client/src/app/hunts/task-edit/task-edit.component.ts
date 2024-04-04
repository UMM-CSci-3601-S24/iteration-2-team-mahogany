import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

@Component ({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, RouterLink]
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router,
    private fb: FormBuilder // inject FormBuilder
  ) {
    this.taskForm = this.fb.group({
      huntId: new FormControl('', Validators.required),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ])),
    });
  }

  readonly editTaskValidationMessages = {
    name: [
      { type: 'required', message: 'Task Name is required' },
      { type: 'minlength', message: 'Name must be at least 5 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 100 characters long' }
    ]
  };

  formControlHasError(controlName: string): boolean {
    return this.taskForm.get(controlName).invalid &&
      (this.taskForm.get(controlName).dirty || this.taskForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.editTaskValidationMessages): string {
    for(const {type, message} of this.editTaskValidationMessages[name]) {
      if (this.taskForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.getTaskById(id).subscribe(task => {
      console.log(task); // log the task object
      this.taskForm.patchValue(task);
    });
    
  }

onSubmit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.hostService.editTask(id, this.taskForm.value).subscribe(() => {
    this.router.navigate(['/hunts', this.taskForm.get('huntId').value]);
  });
}
}
