import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddUserLinkComponent } from '../modal-add-user-link/modal-add-user-link.component';
import { environment } from 'src/environments/environment';
import { StoreService } from '../store.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  groupId!: string;
  sidenavOpen: boolean = false;
  constructor(
    private sc: ElementRef, 
    private dialog: MatDialog,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.groupId$.subscribe((data) => {
      this.groupId = data;
    });
    this.storeService.sideNav$.subscribe((data) => {
      this.sidenavOpen = data;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    console.log(!this.sc.nativeElement.contains(event.target) && this.sidenavOpen)
    if (!this.sc.nativeElement.contains(event.target) && this.sidenavOpen) {
      this.close();
    }
  }

  add_user():void{
    this.sc.nativeElement.querySelector('#sidenav').style.right = '-100%';
    const dialogRef = this.dialog.open(ModalAddUserLinkComponent, {
      data: { title: 'Invite Players', url: environment.BASE_APP_URL+'?group_id='+this.groupId+'/' },
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle actions after the modal is closed (if needed)
      console.log('Dialog closed: ', result);
      
    });
  }
  close() {
    this.storeService.updateSideNav(false);
    this.sc.nativeElement.querySelector('#sidenav').style.right = '-100%';
  }
}
