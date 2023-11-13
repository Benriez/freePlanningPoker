import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddUserLinkComponent } from '../modal-add-user-link/modal-add-user-link.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(
    private dialog: MatDialog,
    
  ) {}

  add_user():void{
    const dialogRef = this.dialog.open(ModalAddUserLinkComponent, {
      data: { title: 'Invite Players', url: 'http://127.0.0.1:8000/#########/' },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle actions after the modal is closed (if needed)
      console.log('Dialog closed: ', result);
      
    });
  }
  
}
