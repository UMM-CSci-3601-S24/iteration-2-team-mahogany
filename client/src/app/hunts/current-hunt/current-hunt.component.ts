import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { HuntCardComponent } from "../hunt-card.component";
import { CompleteHunt } from '../completeHunt';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { AddTaskComponent } from "../addTask/add-task.component";
import { DeleteTaskDialogComponent } from '../deleteTask/delete-task-dialog.component';
import { DeleteHuntDialogComponent } from '../deleteHunt/delete-hunt-dialog.component';
import { Subject, map, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostService } from 'src/app/hosts/host.service';
import { Hunt } from '../hunt';
import { HuntInstance } from '../huntInstance';

@Component({
    selector: 'app-current-hunt',
    standalone: true,
    templateUrl: './current-hunt.component.html',
    styleUrl: './current-hunt.component.scss',
    imports: [HuntCardComponent, MatCard, MatCardTitle, MatIcon, MatDivider, AddTaskComponent, MatCardContent, MatCardActions, RouterLink]
})
export class CurrentHuntComponent implements OnInit, OnDestroy{
  hunt = input.required<Hunt>();
  simple = input(true);

  huntInstance: HuntInstance;

  confirmDeleteHunt: boolean =false;
  completeHunt: CompleteHunt;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private hostService: HostService, private router: Router, public dialog: MatDialog) { }

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

    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.hostService.getHuntInstance(id)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: huntInstance => {
        this.huntInstance = huntInstance;
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

  deleteHunt(id: string): void {
    console.log('Deleting hunt with ID:', id);
    this.hostService.deleteHunt(id).subscribe(() => {
      console.log('Hunt deleted successfully.');
      this.router.navigate(['/hosts']);
    });
  }

  deleteTask(id: string): void {
    this.hostService.deleteTask(id).subscribe(() => {
      location.reload();
    });
  }


  openDeleteHuntDialog(huntId: string): void {
    const dialogRef = this.dialog.open(DeleteHuntDialogComponent, {
      width: '400px',
      height: '300px',
      data: { huntId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteHunt(huntId);
      }
    });
  }

  openDeleteTaskDialog(taskId: string): void {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      width: '400px',
      height: '300px',
      data: { taskId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteTask(taskId);
      }
    });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
