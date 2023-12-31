// store.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private groupIdSubject = new BehaviorSubject<string>(''); // Initial state
  private usernameSubject = new BehaviorSubject<string>('Player'); // Initial state
  private userIdSubject = new BehaviorSubject<string>(''); // Initial state
  private wsOpenSubject = new BehaviorSubject<boolean>(false); // Initial state
  private sideNavSubject = new BehaviorSubject<boolean>(false); // Initial state
  

  groupId$ = this.groupIdSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  wsOpen$ = this.wsOpenSubject.asObservable();
  sideNav$ = this.sideNavSubject.asObservable();

  updateGroupId(newData: string): void {
    this.groupIdSubject.next(newData);
  }

  updateUsername(newData: string): void {
    this.usernameSubject.next(newData);
  }

  updateUserId(newData: string): void {
    this.userIdSubject.next(newData);
  }

  updateWs(newData: boolean): void {
    this.wsOpenSubject.next(newData);
  }

  updateSideNav(newData: boolean): void {
    this.sideNavSubject.next(newData);
  }
}
