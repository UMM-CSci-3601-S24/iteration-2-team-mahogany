import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';




@Component ({
  selector: 'app-hunt-edit',
  templateUrl: './hunt-edit.component.html',
  styleUrls: ['./hunt-edit.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, RouterLink, CommonModule]
})



export class HuntEditComponent implements OnInit {
  huntform: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router,
    private fb: FormBuilder // inject FormBuilder
  ) {
    this.huntform = this.fb.group({
      name: new FormControl(),
      description: new FormControl(),
      est: new FormControl(),
      hostId: new FormControl(),
      numberOfTasks: new FormControl()

    });
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.getHuntById(id).subscribe(completeHunt => {
      console.log(completeHunt); // log the CompleteHunt object

      this.huntform.setValue({
        name: completeHunt.hunt.name,
        description: completeHunt.hunt.description,
        est: completeHunt.hunt.est,
        hostId: completeHunt.hunt.hostId,
        numberOfTasks: completeHunt.hunt.numberOfTasks

      });
    });
  }
  onSubmit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.editHunt(id, this.huntform.value).subscribe({
      next: () => {
        // Handle successful update
        // For example, navigate back to the list of hunts
        this.router.navigate(['/hosts']);
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
