// store.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private groupIdSubject = new BehaviorSubject<string>(''); // Initial state

  groupId$ = this.groupIdSubject.asObservable();

  updateGroupId(newData: string): void {
    this.groupIdSubject.next(newData);
  }
}
