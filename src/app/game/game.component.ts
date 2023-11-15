import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Renderer2, HostListener} from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { StoreService } from '../store.service';
import { v4 as uuidv4 } from 'uuid';

interface Player {
  user_id: typeof uuidv4;
  username: string;
  card?: number;
}
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  cards = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89 , '?', '☕️'];
  username: string = "Player";
  players: Player[] = [];
  selectedCardElement!: HTMLElement;
  gameStatus : any;
  group_id: any= null;
  user_id: any = uuidv4();

  socketSubscription!: Subscription;
  public messagetype: string | undefined;



  constructor(
    private gs: ElementRef, 
    private renderer: Renderer2, 
    private websocketService: WebsocketService,
    private storeService: StoreService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    console.log('Page is about to reload. Execute code here.');
    console.log(this.players);
    // Uncomment the following line if you want to show a confirmation dialog
    //$event.returnValue = true;
  }

  ngOnInit(): void {
    this.user_id = uuidv4();

    try {
      const urlParams = new URLSearchParams(window.location.search);
      let stringGID = urlParams.get('group_id');
      this.group_id = stringGID?.slice(0, -1);
    } catch (error) {}


    //check localstorage for group_id and user_id
    if (!this.group_id){
      try {
        this.group_id = localStorage.getItem('group_id');
        this.user_id = localStorage.getItem('user_id');
        console.log('locastorage checked: ', this.group_id, this.user_id);
      }
      catch (error) {}

    } else {
      this.user_id = localStorage.getItem('user_id');
      console.log('locastorage checked: ', this.group_id, this.user_id);
    }
    


  }
  ngAfterViewInit(): void {
    this.gameStatus = this.gs.nativeElement.querySelector('#gameStatus');
    this.socketSubscription = this.websocketService.openConnection().subscribe({
      next: (message: string) => {
        const parsedMessage = JSON.parse(message);
        this.messagetype = parsedMessage.message;

        //-----------------------------------------------------------------------
        if(this.messagetype == "ws-connection-established"){
          // check if url contains group_id
          if (!this.group_id){
            this.group_id = parsedMessage.group_id;
            
          }
           
          this.storeService.updateGroupId(this.group_id);          
          this.websocketService.sendMessage(JSON.stringify({
            message: "user-joins-group", 
            group_id: this.group_id,
            username: this.username,
            user_id: this.user_id
          }));
          
          localStorage.setItem('group_id', this.group_id);
          localStorage.setItem('user_id', this.user_id);

      
        }
        if(this.messagetype == "ws-user-joins-group"){    
          this.players = [];
          parsedMessage.players.forEach((player: Player) => {
            const newPlayer: Player = { user_id: player.user_id, username: player.username, card: player.card };
            this.players.push(newPlayer);
          });

          console.log("Players: " + this.players);  
 

        }









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
    // remove selected class from previous card
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

    this.websocketService.sendMessage(JSON.stringify({
      message: "user-card-selected",
      user_id: this.user_id, 
      card: value
    }));

  }

  revealCards(){
    console.log("Reveal Cards");
  }
}
