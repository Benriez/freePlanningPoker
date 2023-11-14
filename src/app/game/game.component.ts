import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Renderer2, inject,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  fibonaci_numbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89 , '?', '☕️'];
  players = ["Player 1", "Player 2", "Player 3"];
  selectedCardElement!: HTMLElement;
  gameStatus : any;
  group_id: any= null;

  socketSubscription!: Subscription;
  public messagetype: string | undefined;



  constructor(
    private gs: ElementRef, 
    private renderer: Renderer2, 
    private websocketService: WebsocketService,
    private storeService: StoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    // Access specific parameter values
    let stringGID = urlParams.get('group_id');
    this.group_id = stringGID?.slice(0, -1);
    console.log('groupId: ' + this.group_id);
  }
  ngAfterViewInit(): void {
    this.gameStatus = this.gs.nativeElement.querySelector('#gameStatus');
    this.socketSubscription = this.websocketService.openConnection().subscribe({
      next: (message: string) => {
        const parsedMessage = JSON.parse(message);
  
        this.messagetype = parsedMessage.message;

        if(this.messagetype == "ws-connection-established"){
          if (!this.group_id){
            this.group_id = parsedMessage.group_name;
          }
          console.log("Group ID: " + this.group_id);  
          this.storeService.updateGroupId(this.group_id);
        }
        // if (message ==)
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
