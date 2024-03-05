import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';




@Component ({
  selector: 'app-hunt-edit',
  templateUrl: './hunt-edit.component.html',
  styleUrls: ['./hunt-edit.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, RouterLink]
})



export class HuntEditComponent implements OnInit {

  huntform = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    est: new FormControl(),
  });



  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.getHuntById(id).subscribe(completeHunt => {
      this.huntform.setValue({
        name: completeHunt.hunt.name,
        description: completeHunt.hunt.description,
        est: completeHunt.hunt.est,
        // Add other form controls as needed
      });
    });
  }


  onSubmit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hostService.editHunt(id, this.huntform.value as { name: string; description: string; est: number; }).subscribe(() => {
      // Handle successful update
      // For example, navigate back to the list of hunts
      this.router.navigate(['/hunts']);
    });
  }
}
