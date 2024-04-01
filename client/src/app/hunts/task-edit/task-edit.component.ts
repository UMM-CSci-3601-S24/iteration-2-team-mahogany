import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { ReactiveFormsModule } from '@angular/forms'; // Move this import statement to the top of the file


@Component ({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'], // Remove the comma here
  standalone: true,
  imports: [ReactiveFormsModule] // Remove this line
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
      huntId: new FormControl(),
      name: new FormControl(),
    });
  }




  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.getTaskById(id).subscribe(task => {
      console.log(task); // log the task object
      this.taskForm.patchValue(task);

    });
  }


//   onSubmit(): void {
//     if (this.taskForm.valid) {
//       this.hostService.editTask(this.taskForm.value).subscribe(() => {
//         this.router.navigate(['/hunts']);
//       });
//     }
//   }
// }

onSubmit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.hostService.editTask(id, this.taskForm.value).subscribe(() => {
    this.router.navigate(['/hosts']);
  });
}
}



