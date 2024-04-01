/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeletePhotoComponent } from './delete-photo.component';

describe('DeletePhotoComponent', () => {
  let component: DeletePhotoComponent;
  let fixture: ComponentFixture<DeletePhotoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DeletePhotoComponent]
    });

    fixture = TestBed.createComponent(DeletePhotoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

   it('should delete a photo', () => {
    const filename = 'test.jpg';
    const spy = spyOn(window, 'alert').and.callThrough();

    component.deletePhoto(filename);

    const req = httpMock.expectOne(`http://localhost:4200/api/photos/${filename}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({}); // Trigger the subscribe callback

    expect(spy).toHaveBeenCalledWith('Photo deleted successfully');
  });

  it('should handle errors', () => {
    const filename = 'test.jpg';
    const spy = spyOn(window, 'alert').and.callThrough();

    component.deletePhoto(filename);

    const req = httpMock.expectOne(`http://localhost:4200/api/photos/${filename}`);
    expect(req.request.method).toBe('DELETE');

    req.error(new ErrorEvent('Network error')); // Trigger the error callback

    expect(spy).toHaveBeenCalledWith('Error deleting photo: Http failure response for http://localhost:4200/api/photos/test.jpg: 0 ');
  });
});
 */
