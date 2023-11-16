import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//import environment variables
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly serverUrl = '';

  constructor() {
    if (environment.production) {
      console.log('Production environment');
    } else {
      console.log('Development environment');
      console.log('WS_URL:', environment.WS_URL);
    }
  }

  public openConnection(): Observable<any> {
    this.socket = new WebSocket(environment.WS_URL);

    return new Observable(observer => {
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
