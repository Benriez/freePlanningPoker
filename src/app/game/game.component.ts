import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  fibonaci_numbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89 , '?', '☕️'];
  players = ["Player 1", "Player 2", "Player 3"];
  selectedCardElement!: HTMLElement;
  gameStatus : any;

  private socketSubscription!: Subscription;
  public messageReceived: string | undefined;

  constructor(private gs: ElementRef, private renderer: Renderer2, private websocketService: WebsocketService) {}

  ngAfterViewInit(): void {
    this.gameStatus = this.gs.nativeElement.querySelector('#gameStatus');
    this.socketSubscription = this.websocketService.openConnection().subscribe({
      next: (message: string) => {
        this.messageReceived = message;
        console.log(message);
      },
      error: (error: string) => {
        console.error(error);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      }
    });
  }


 

  disconnect(): void {
    this.websocketService.closeConnection();
  }

  
  select_card(cardElement: HTMLElement, value: any){
    if (cardElement != this.selectedCardElement){
      try {
        this.selectedCardElement.classList.remove("scroll-selection-selected");
      } catch (error) {}
    } 

    this.selectedCardElement = cardElement;
    this.selectedCardElement.classList.add("scroll-selection-selected");
    
  
    const buttonElement = this.gameStatus.querySelector('button');
    if (buttonElement) {
      const buttonLabelElement = buttonElement.querySelector('.mdc-button__label');
      if (buttonLabelElement) {
        this.renderer.setProperty(buttonLabelElement, 'textContent', 'Waiting for other players...');
      }
    }

    buttonElement.disabled = false;
    this.gameStatus.style.backgroundColor = "rgb(0, 212, 51)";

  }

  revealCards(){
    console.log("Reveal Cards");
  }
}
