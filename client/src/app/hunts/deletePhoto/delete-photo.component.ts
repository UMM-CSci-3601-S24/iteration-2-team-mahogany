import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-photo',
  templateUrl: './delete-photo.component.html',
  standalone: true
})
export class DeletePhotoComponent {
  constructor(private http: HttpClient) {}

  deletePhoto(filename: string): void {
    this.http.delete(`http://localhost:4200/api/photo/${filename}`)
      .subscribe(
        () => alert('Photo deleted successfully'),
        error => alert('Error deleting photo: ' + error.message)
      );
  }
}
