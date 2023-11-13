import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-add-user-link',
  templateUrl: './modal-add-user-link.component.html',
  styleUrls: ['./modal-add-user-link.component.css']
})
export class ModalAddUserLinkComponent {
  invitationLink = 'http://127.0.0.1:8000/#########/';
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalAddUserLinkComponent>,
    private toastr: ToastrService
  ) {}

  get title(): string {
    return this.data.title;
  }

  get url(): string {
    return this.data.url;
  }

  close(): void {
    this.dialogRef.close();
  }
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.invitationLink)
    .then(() => {
      // Successfully copied
      console.log('Invitation link copied to clipboard:', this.invitationLink);
      this.close();
      this.toastr.success('Invitation link copied to clipboard', 'Success!');
    })
    .catch((error) => {
      // Handle any errors
      console.error('Unable to copy to clipboard:', error);
    });
  }
}
