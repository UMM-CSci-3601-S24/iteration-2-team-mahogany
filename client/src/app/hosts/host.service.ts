import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from '../hunts/hunt';
import { Task } from '../hunts/task';
import { CompleteHunt } from '../hunts/completeHunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;
  readonly taskUrl: string = `${environment.apiUrl}tasks`;

  constructor(private httpClient: HttpClient){
  }

  getHunts(hostId: string): Observable<Hunt[]> {
    console.log("Getting hunts for host with id: " + hostId);
    console.log(this.hostUrl + "/" + hostId);
    return this.httpClient.get<Hunt[]>(`${this.hostUrl}/${hostId}`);
  }

  getHuntById(id: string): Observable<CompleteHunt> {
    return this.httpClient.get<CompleteHunt>(`${this.huntUrl}/${id}`);
  }
  getTaskById(id: string): Observable<CompleteHunt> {
    return this.httpClient.get<CompleteHunt>(`${this.taskUrl}/${id}`);
  }

  addHunt(newHunt: Partial<Hunt>): Observable<string> {
    newHunt.hostId = "588945f57546a2daea44de7c";
    return this.httpClient.post<{id: string}>(this.huntUrl, newHunt).pipe(map(result => result.id));
  }

  addTask(newTask: Partial<Task>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.taskUrl, newTask).pipe(map(res => res.id));
  }

  editHunt(id: string, updatedHunt: { name: string; description: string; est: number; }): Observable<Hunt> {
    console.log("Editing hunt with id: " + id);
    console.log(this.huntUrl + "/" + id);
    return this.httpClient.put<Hunt>(`${this.huntUrl}/${id}`, updatedHunt);
  }
  editTask(id: string, updatedTask: Partial<Task>): Observable<Task> {
    console.log("Editing task with id: " + id);
    console.log(this.taskUrl + "/" + id);
    return this.httpClient.put<Task>(`${this.taskUrl}/${id}`, updatedTask);
  }
  deleteHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/hunts/${id}`);
  }

}
