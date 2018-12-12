import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ImageData {
  url: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  constructor() {}

  private _imageData$ = new BehaviorSubject<ImageData>(null);
  get imageData$(): BehaviorSubject<ImageData> {
    return this._imageData$;
  }
}
