import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {
  photoUrl: SafeUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const filename = this.route.snapshot.paramMap.get('filename');
    this.http.get(`/api/photo/${filename}`, { responseType: 'blob' }).subscribe(photo => {
      const objectUrl = URL.createObjectURL(photo);
      this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    });
}
}
