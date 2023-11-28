import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavComponent } from './nav/nav.component';
import { GameComponent } from './game/game.component';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ModalAddUserLinkComponent } from './modal-add-user-link/modal-add-user-link.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModalChangeNameComponent } from './modal-change-name/modal-change-name.component';
import { Location } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    GameComponent,
    ModalAddUserLinkComponent,
    ModalChangeNameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastClass: 'custom-toastr-position', // Apply custom styling
      // Other configuration options...
    })
  ],
  providers: [Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
