import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit {
  constructor(private dataAccess: DataAccessService) {}

  ngOnInit() {}
}
