import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from './store.service';
//import environment variables
import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService{
  private socket!: WebSocket;
  private readonly serverUrl = environment.WS_URL;
  user_id: any = uuidv4();


  public openConnection(): Observable<any> {
    this.socket = new WebSocket(this.serverUrl);
    console.log('ws open connection')
    return new Observable(observer => {
      this.socket.addEventListener('open', () => {
        // Connection opened, send the initial messagew
        let group_id = localStorage.getItem('group_id');
        this.user_id = localStorage.getItem('user_id');
        let username = localStorage.getItem('username');
    

        if (this.user_id == null || this.user_id == ''){
          this.user_id = uuidv4(); 
          console.log('new user_id: ', this.user_id);
          localStorage.setItem('user_id', this.user_id.toString());
          console.log(this.user_id)
          console.log('set localstorage')
        }
        if (group_id == null){
          group_id="joo"
        }
        if (username == null){
          username="Player"
        }
  

        console.log('send user_id: ', this.user_id);
        this.sendMessage(JSON.stringify({
          message: "init-user", 
          group_id: group_id,
          user_id: this.user_id,
          username: username,
          card: 3
        }));
        
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
}
