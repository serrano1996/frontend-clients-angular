import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  private _notifyUpload = new EventEmitter<any>();

  constructor() { }

  showModal() {
    this.modal = true;
  }

  hiddenModal() {
    this.modal = false;
  }

  get notifyUpload(): EventEmitter<any> {
    return this._notifyUpload;
  }

}
