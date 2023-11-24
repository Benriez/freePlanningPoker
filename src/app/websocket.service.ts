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
import { Observable } from 'rxjs';
import { StoreService } from './store.service';
//import environment variables
import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly serverUrl = environment.WS_URL;
  user_id: any = uuidv4();
  group_id: any = null;

  constructor(public storeService: StoreService) {}


  public openConnection(): Observable<any> {
    this.socket = new WebSocket(this.serverUrl);
    console.log('ws open connection: ', this.serverUrl)
    return new Observable(observer => {
      this.socket.addEventListener('open', () => {
        console.log('ws open')
        this.storeService.updateWs(true);        
      });

      this.socket.addEventListener('message', (event: MessageEvent) => {
        observer.next(event.data);
      });

      this.socket.addEventListener('close', (event: CloseEvent) => {
        observer.complete();
      });

      this.socket.addEventListener('error', (event: Event) => {
        observer.error('WebSocket error!');
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

  // parseUrl(){
  //   try {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     let stringGID = urlParams.get('group_id');
  //     this.group_id = stringGID?.slice(0, -1);
  //     console.log('parse url group id: ', this.group_id)
  //     console.log('wwwwwwwwhat')
  //     if (this.group_id != null && this.group_id != 'undefined'){
  //       console.log('set group id: ', this.group_id)
  //       localStorage.setItem('group_id ', this.group_id);
  //       this.storeService.updateGroupId(this.group_id);
  //     }

  //   } catch (error) {}
  // }
}
