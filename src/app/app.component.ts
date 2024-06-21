import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-lambda-app';
  private lambdaUrl =
    'https://dyjwjdhxbfcbxn33et7zfdjpnm0urzeh.lambda-url.us-east-2.on.aws';

  constructor(private http: HttpClient) {}

  onButtonClick(): void {
    const payload = { key: 'value' };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Amz-Invocation-Type': 'RequestResponse',
      'X-Amz-Log-Type': 'Tail',
    });

    this.http
      .post(this.lambdaUrl, payload, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            console.error('An error occurred:', error.error.message);
          } else {
            // Server-side error
            console.error(
              `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`
            );
          }
          // Return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      )
      .subscribe((response) => {
        console.log('Lambda function response:', response);
        alert('Lambda function response: ' + JSON.stringify(response));
      });
  }
}
