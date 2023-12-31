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
@Component({
  selector: 'app-modal-change-name',
  templateUrl: './modal-change-name.component.html',
  styleUrls: ['./modal-change-name.component.css']
})
export class ModalChangeNameComponent implements OnInit {
  groupId!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalChangeNameComponent>,
    private toastr: ToastrService,
    private storeService: StoreService
  ) {}

  get title(): string {
    return this.data.title;
  }

  get username(): string {
    return this.data.username;
  }

  ngOnInit(): void {
    this.storeService.groupId$.subscribe((data) => {
      this.groupId = data;
    });
    // this.storeService.username$.subscribe((data) => {
    //   this.name = data;
    // });
  }

  updateUser(username: string): void {
    if (username === '' || username === this.username) {
      this.dialogRef.close();
      return;
    } else if (username.length > 10) {
      this.toastr.error('Username must be at most 10 characters long', 'Error!');
      return;
    } else if (!username.match(/^[a-zA-Z0-9]+$/)) {
      this.toastr.error('Username must contain only letters and numbers', 'Error!');
      return;
    } 

    this.storeService.updateUsername(username);
    localStorage.setItem('username', username);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}
