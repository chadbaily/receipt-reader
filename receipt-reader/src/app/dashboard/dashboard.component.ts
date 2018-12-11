import { Component, OnInit } from '@angular/core';

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

  constructor() {}

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
}
