import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

@Component ({
  selector: 'app-hunt-edit',
  templateUrl: './hunt-edit.component.html',
  styleUrls: ['./hunt-edit.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, RouterLink]
})
export class HuntEditComponent implements OnInit {
  huntForm: FormGroup;
  huntId: string;

  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router,
    private fb: FormBuilder // inject FormBuilder
  ) {
    this.huntForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])),
      est: new FormControl('', Validators.compose([
        Validators.required,
        Validators.max(240),
        Validators.min(5),
        Validators.pattern('[0-9]+')
      ])),
      hostId: new FormControl('', Validators.required),
      numberOfTasks: new FormControl('', Validators.required)
    });
  }

  readonly editHuntValidationMessages = {
    name: [
      { type: 'required', message: 'Hunt Name is required' },
      { type: 'minlength', message: 'Hunt Name must be at least 5 characters long' },
      { type: 'maxlength', message: 'Hunt Name cannot be more than 50 characters long' }
    ],
    description: [
      { type: 'required', message: 'Description is required' },
      { type: 'minlength', message: 'Name must be at least 5 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 100 characters long' }
    ],
    est: [
      { type: 'required', message: 'Estimated Time is required' },
      { type: 'max', message: 'Estimated Time cannot exceed 240 minutes' },
      { type: 'min', message: 'Estimated Time has a minimum of 5 minutes' },
      { type: 'pattern', message: 'Estimated Time must be a number' }
    ]
  };

  formControlHasError(controlName: string): boolean {
    return this.huntForm.get(controlName).invalid &&
      (this.huntForm.get(controlName).dirty || this.huntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.editHuntValidationMessages): string {
    for(const {type, message} of this.editHuntValidationMessages[name]) {
      if (this.huntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }


  ngOnInit(): void {
    this.huntId = this.route.snapshot.paramMap.get('id');
    this.hostService.getHuntById(this.huntId).subscribe(completeHunt => {
      console.log(completeHunt); // log the CompleteHunt object

      this.huntForm.setValue({
        name: completeHunt.hunt.name,
        description: completeHunt.hunt.description,
        est: completeHunt.hunt.est,
        hostId: completeHunt.hunt.hostId,
        numberOfTasks: completeHunt.hunt.numberOfTasks

      });
    });
  }
  onSubmit(): void {
    this.huntId = this.route.snapshot.paramMap.get('id');
    this.hostService.editHunt(this.huntId, this.huntForm.value).subscribe({
      next: () => {
        // Handle successful update
        // For example, navigate back to the list of hunts
        this.router.navigate(['/hunts', this.huntId]);
      },
      error: (err) => {
        // Handle error
        // For example, log the error and show an error message to the user
        console.error(`Failed to update hunt: ${err.message}`);
        // Show an error message to the user
        // This depends on how you handle user notifications in your app
      }
    });
  }
}
