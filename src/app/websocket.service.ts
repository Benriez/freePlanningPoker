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
  private readonly serverUrl = "wss://ffp-django.cloud.code-server.de/ws/";
  user_id: any = uuidv4();
  group_id: any = null;

  constructor(public storeService: StoreService) {}


  public openConnection(): Observable<any> {
    this.socket = new WebSocket(this.serverUrl);
    console.log('ws open connection')
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
