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
import { Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StoreService } from './store.service';
//import environment variables
import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { Location } from '@angular/common';
import { switchMap, takeWhile, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly serverUrl = environment.WS_URL;
  user_id: any = uuidv4();
  group_id: any = null;

  constructor(public storeService: StoreService, private location: Location) {}


  public openConnection(): Observable<any> {
    this.socket = new WebSocket(this.serverUrl);
    const reconnectSubject = new Subject();
  
    const createWebSocket = () => {
      this.socket = new WebSocket(this.serverUrl);
  
      this.socket.addEventListener('open', () => {
        console.log('ws open');
        this.storeService.updateWs(true);
      });
  
      this.socket.addEventListener('message', (event: MessageEvent) => {
        reconnectSubject.next(event.data);
      });
  
      this.socket.addEventListener('close', (event: CloseEvent) => {
        console.log('ws close');
        reconnectSubject.complete();
      });
  
      this.socket.addEventListener('error', (event: Event) => {
        console.error('WebSocket error!');
        // reconnectSubject.error('WebSocket error!');
        reconnectSubject.complete();
      });
    };
  
    createWebSocket();
  
    return new Observable(observer => {
      const subscription = reconnectSubject.subscribe({
        next: data => observer.next(data),
        complete: () => {
          // Reconnect logic using while loop
          const reconnectInterval = 3000; // Adjust the interval as needed
          let reconnecting = true;
    
          const reconnect = () => {
            console.log('Attempting to reconnect...');
            createWebSocket();
    
            setTimeout(() => {
              reconnecting && reconnect(); // Continue reconnecting as long as the flag is true
            }, reconnectInterval);
          };
    
          reconnect();
    
          observer.complete = () => {
            reconnecting = false; // Stop reconnecting when observer is completed
            subscription.unsubscribe(); // Unsubscribe to avoid memory leaks
          };
    
        },
      });
    });
  }

  public sendMessage(message: string): void {
    this.socket.send(message);
  }

  public closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

}
