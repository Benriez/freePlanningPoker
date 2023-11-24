 /*
 * Freeplanningpoker
 * Version 0.0.1
 * Copyright 2023 Benjamin Riezler
 *
 * Freeplanningpoker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Freeplanningpoker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MyLibrary. If not, see <http://www.gnu.org/licenses/>.
 */
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
  base_link = environment.BASE_APP_URL+this.url_prameter;
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
