import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddUserLinkComponent } from '../modal-add-user-link/modal-add-user-link.component';
import { StoreService } from '../store.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  groupId!: string;
  constructor(
    private dialog: MatDialog,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.groupId$.subscribe((data) => {
      this.groupId = data;
    });
  }

  add_user():void{
    const dialogRef = this.dialog.open(ModalAddUserLinkComponent, {
      data: { title: 'Invite Players', url: 'http://localhost:4200/?group_id='+this.groupId+'/' },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle actions after the modal is closed (if needed)
      console.log('Dialog closed: ', result);
      
    });
  }
  
}
