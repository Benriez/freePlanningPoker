import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly serverUrl = 'ws://127.0.0.1:8000/ws/';

  public openConnection(): Observable<any> {
    this.socket = new WebSocket(this.serverUrl);

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
