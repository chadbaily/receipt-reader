import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataAccessService } from '../data-access.service';
import { Router } from '@angular/router';
// import { ocrSpaceApi } from 'ocr-space-api';

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

interface ParsedResultsOBJ {
  ParsedText: string;
}

interface OCRParsedResult extends Object {
  ParsedResults: Array<ParsedResultsOBJ>;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  name = null;
  url = '';
  selectedFile: File;
  loading = false;
  result = null;
  private regex: RegExp = /(\w+|\w+\:)\s*((\d+.\d+)|(\$\d+.\d+))/g;
  public total = null;

  constructor(
    private http: HttpClient,
    private dataAccess: DataAccessService,
    private router: Router
  ) {}

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
        .subscribe((res: OCRParsedResult) => {
          // console.log(res);
          this.result = res.ParsedResults[0].ParsedText;
          const regexMatch = this.result.match(this.regex);
          // console.log(this.result);
          this.determineTotal(regexMatch);
          this.dataAccess.imageData$.next({ url: this.url, total: this.total });
          if (this.total) {
            this.router.navigateByUrl('/confirm');
          }
          console.log(this.dataAccess.imageData$.getValue());
        });
    }
  }

  private determineTotal(matches: string[]) {
    for (let i = 0; i < matches.length; i++) {
      const splits = matches[i].split(' ');
      if (splits.length === 2) {
        if (
          splits[0].toUpperCase() === 'TOTAL' ||
          splits[0].toUpperCase() === 'BALANCE'
        ) {
          this.total = +splits[1];
          return;
        }
      }
    }
    return null;
  }
}
