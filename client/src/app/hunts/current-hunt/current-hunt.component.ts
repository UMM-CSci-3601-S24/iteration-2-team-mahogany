import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { HuntCardComponent } from "../hunt-card.component";
import { CompleteHunt } from '../completeHunt';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { AddTaskComponent } from "../addTask/add-task.component";
import { DeleteTaskDialogComponent } from '../deleteTask/delete-task-dialog.component';
import { DeleteHuntDialogComponent } from '../deleteHunt/delete-hunt-dialog.component';
import { Subject, Subscription, interval, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostService } from 'src/app/hosts/host.service';
import { Hunt } from '../hunt';

@Component({
    selector: 'app-current-hunt',
    standalone: true,
    templateUrl: './current-hunt.component.html',
    styleUrl: './current-hunt.component.scss',
    imports: [HuntCardComponent, MatCard, MatCardTitle, MatIcon, MatDivider, AddTaskComponent, MatCardContent, MatCardActions, RouterLink]
})
export class CurrentHuntComponent implements OnInit, OnDestroy {
  hunt = input.required<Hunt>();
  completeHunt: CompleteHunt;
  error: { help: string, httpResponse: string, message: string };
  secondsElapsed: number = 0;
  private ngUnsubscribe = new Subject<void>();
  private timerSubscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private hostService: HostService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Start the timer
    this.timerSubscription = interval(1000)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.secondsElapsed++;
      });

    // Fetch hunt data
    this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => this.hostService.getHuntById(paramMap.get('id'))),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: completeHunt => {
        this.completeHunt = completeHunt;
      },
      error: err => {
        this.error = {
          help: 'There was a problem loading the hunt – try again.',
          httpResponse: err.message,
          message: err.error?.title,
        };
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  deleteHunt(id: string): void {
    this.hostService.deleteHunt(id).subscribe(() => {
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

  stopCountUp(): void {
    // Stop the timer
    this.timerSubscription.unsubscribe();
  }
}
