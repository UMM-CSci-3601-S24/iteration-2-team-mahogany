import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../../hosts/host.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html', // Change this line
  standalone: true,
  imports: [RouterModule]

})

export class AddPhotoComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private hostService: HostService) { }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:4200/api/upload', formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      this.selectedFile = file[0];
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      this.hostService.addPhoto(this.selectedFile).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
      console.log('File submitted:', this.selectedFile.name);
    }
  }
}
