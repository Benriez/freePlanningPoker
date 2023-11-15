

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

  changeUsername(username: string): void {
    console.log('New username:', username);
    this.storeService.updateUsername(username);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}
