import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddUserLinkComponent } from '../modal-add-user-link/modal-add-user-link.component';
import { StoreService } from '../store.service';
import { environment } from 'src/environments/environment';
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
      data: { title: 'Invite Players', url: environment.BASE_APP_URL+'?group_id='+this.groupId+'/' },
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle actions after the modal is closed (if needed)
      console.log('Dialog closed: ', result);
      
    });
  }
  
}
