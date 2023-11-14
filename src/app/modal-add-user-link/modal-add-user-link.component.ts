import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from '../store.service';
@Component({
  selector: 'app-modal-add-user-link',
  templateUrl: './modal-add-user-link.component.html',
  styleUrls: ['./modal-add-user-link.component.css']
})
export class ModalAddUserLinkComponent implements OnInit {
  invitationLink = 'http://127.0.0.1:8000/';
  groupId!: string;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalAddUserLinkComponent>,
    private toastr: ToastrService,
    private storeService: StoreService
  ) {}

  get title(): string {
    return this.data.title;
  }

  get url(): string {
    return this.data.url;
  }

  ngOnInit(): void {
    this.storeService.groupId$.subscribe((data) => {
      this.groupId = data;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.invitationLink+this.groupId+'/')
    .then(() => {
      // Successfully copied
      console.log('Invitation link copied to clipboard:', this.invitationLink+this.groupId+'/');
      this.close();
      this.toastr.success('Invitation link copied to clipboard', 'Success!');
    })
    .catch((error) => {
      // Handle any errors
      console.error('Unable to copy to clipboard:', error);
    });
  }
}
