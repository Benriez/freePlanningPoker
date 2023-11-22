import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from '../store.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-modal-add-user-link',
  templateUrl: './modal-add-user-link.component.html',
  styleUrls: ['./modal-add-user-link.component.css']
})
export class ModalAddUserLinkComponent implements OnInit {
  groupId!: string;
  url_prameter='?group_id='
  base_link = environment.BASE_URL+this.url_prameter;
  invitationLink = '';

  
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
    console.log('modal add user link')
    this.storeService.groupId$.subscribe((data) => {
      this.groupId = data;
      this.invitationLink = this.base_link + this.groupId + '/'
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.invitationLink)
    .then(() => {
      this.close();
      this.toastr.success('Invitation link copied to clipboard', 'Success!');
    })
    .catch((error) => {
      console.error('Unable to copy to clipboard:', error);
    });
  }
}
