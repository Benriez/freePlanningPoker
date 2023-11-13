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
    private dialog: MatDialog
  ) {}

  add_user():void{
    const dialogRef = this.dialog.open(ModalAddUserLinkComponent, {
      data: { title: 'Invite Players', url: 'Modal Content' },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle actions after the modal is closed (if needed)
    });
  }
}
