import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ocrSpaceApi } from 'ocr-space-api';

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  name = null;
  url = '';
  selectedFile: File;
  loading = false;
  result = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onFileSelected(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.loading = true;
      reader.onload = (newEvent: FileReaderEvent) => {
        this.loading = false;
        this.url = newEvent.target.result;
      };
    }
    this.selectedFile = event.target.files[0];
    this.name = event.target.files[0].name;
  }

  onUpload() {
    console.log('uploading...');
    if (this.selectedFile && this.name) {
      const base64Image = this.url;
      const data =
        encodeURIComponent('base64Image') +
        '=' +
        encodeURIComponent(base64Image) +
        '&' +
        encodeURIComponent('isTable') +
        '=' +
        encodeURIComponent('true');

      this.http
        .post('https://api.ocr.space/parse/image', data, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('apikey', 'e32e197b2488957')
        })
        .subscribe(res => {
          console.log(res);
          this.result = res.ParsedResults[0].ParsedText;
          console.log(this.result);
        });

      //   this.imageApi
      //     .parseImageFromLocalFile(this.url, options)
      //     .then(function(parsedResult) {
      //       console.log('parsedText: \n', parsedResult.parsedText);
      //       console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
      //     })
      //     .catch(function(err) {
      //       console.log('ERROR:', err);
      //     });
      //   // this.http.post();
    }
  }
}
