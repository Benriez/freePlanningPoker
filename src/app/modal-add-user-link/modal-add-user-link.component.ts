import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-add-user-link',
  templateUrl: './modal-add-user-link.component.html',
  styleUrls: ['./modal-add-user-link.component.css']
})
export class ModalAddUserLinkComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  get title(): string {
    return this.data.title;
  }

  get url(): string {
    return this.data.url;
  }

  close(): void {
    // You can perform additional actions before closing the modal
  }
}
