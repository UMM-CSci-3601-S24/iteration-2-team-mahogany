import { Component, input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, ParamMap, RouterLink, Router } from "@angular/router";
import { HostService } from "src/app/hosts/host.service";
import { CompleteHunt } from "../completeHunt";
import { HuntCardComponent } from "../hunt-card.component";
import { map } from "rxjs/internal/operators/map";
import { Subject, switchMap, takeUntil } from "rxjs";
import { HuntInstance } from "../huntInstance";




@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
    standalone: true,
    imports: [HuntCardComponent, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, RouterLink],
    providers: [HostService]
})



export class AddTaskComponent {

  huntInstanceId: string;
  huntId = input.required<string>();
  addTask: boolean = false;
  completeHunt: CompleteHunt;
  error: { help: string, httpResponse: string, message: string };
  private ngUnsubscribe = new Subject<void>();

  addTaskForm = new FormGroup({
    huntId: new FormControl(),
    status: new FormControl(),

    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])),
  });

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('id')),

      switchMap((id: string) => this.hostService.getHuntById(id)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: completeHunt => {
        this.completeHunt = completeHunt;
        return ;
      },
      error: _err => {
        this.error = {
          help: 'There was a problem loading the hunt – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }

    });
  }

  readonly addTaskValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ],
  };

  constructor(
    private hostService: HostService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
    ,) {
  }

  createHuntInstance(huntId: string): void {
    console.log('Hunt ID:', huntId);
    this.hostService.createHuntInstance(huntId).subscribe((huntInstance: HuntInstance) => {
      console.log('Created hunt instance with ID:', huntInstance._id);
      // Assuming HuntInstance has an 'id' property
    }, (error) => {
      console.error('Error creating hunt instance:', error);
    });
  }

  createAndNavigateToHuntInstance(huntId: string): void {
    this.hostService.createHuntInstance(huntId).subscribe({
      next: (huntInstance: HuntInstance) => {
        console.log('HuntInstance:', huntInstance);
        if (huntInstance) {
          this.huntInstanceId = huntInstance.id;
          console.log('HuntInstance ID:', this.huntInstanceId);
          if (this.huntInstanceId) {
            this.router.navigate(['/hunts/current/', this.huntInstanceId]);
          } else {
            // Handle the case where huntInstanceId is undefined
            console.error('huntInstanceId is undefined');
          }

        } else {
          console.log('HuntInstance is null');
        }
      },
      error: _err => {
        console.error('Error creating hunt instance:', _err);
      }
    });
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
