import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Renderer2, HostListener} from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { StoreService } from '../store.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModalChangeNameComponent } from '../modal-change-name/modal-change-name.component';

interface Player {
  user_id: typeof uuidv4;
  username: string;
  card?: number;
}
const INITIAL_COUNTDOWN_VALUE = 5;
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
  countdown: number = 5; 
  countdownInterval: any;
  buttonElement: any;
  buttonLabelElement: any;

  socketSubscription!: Subscription;
  public messagetype: string | undefined;



  constructor(
    private gs: ElementRef, 
    private renderer: Renderer2, 
    private websocketService: WebsocketService,
    private storeService: StoreService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    // console.log('Page is about to reload. Execute code here.');
    this.websocketService.sendMessage(JSON.stringify({
      message: "user-leaves-group", 
      group_id: this.group_id,
      username: this.username,
      user_id: this.user_id
    }));
    // Uncomment the following line if you want to show a confirmation dialog
    //$event.returnValue = true;
  }

  ngOnInit(): void {
    this.storeService.userId$.subscribe((data) => {
      this.user_id = data;
    })
    this.subscribeToUsername()

    this.parseUrl();
    this.getLocalStorage();   


  }

  ngAfterViewInit(): void {
    this.gameStatus = this.gs.nativeElement.querySelector('#gameStatus');
    this.buttonElement = this.gameStatus.querySelector('button');
    this.buttonLabelElement = this.buttonElement.querySelector('.mdc-button__label');
    
    
    this.socketSubscription = this.websocketService.openConnection().subscribe({
      next: (message: string) => {
        const parsedMessage = JSON.parse(message);
        this.messagetype = parsedMessage.message;

        //-----------------------------------------------------------------------
        if(this.messagetype == "ws-connection-established"){
          // check if url contains group_id
          if (!this.group_id || this.group_id){
            this.group_id = parsedMessage.group_id;
            
          }
          this.storeService.updateGroupId(this.group_id);          
          this.websocketService.sendMessage(JSON.stringify({
            message: "user-joins-group", 
            group_id: this.group_id,
            username: this.username,
            user_id: this.user_id
          }));
          // this.setLocalStorage();          
        }

        if(this.messagetype == "ws-user-joins-group" || this.messagetype == "ws_waiting_for_players" || this.messagetype == "ws_user_leaves_group" || this.messagetype == "ws_user_update"){    
          this.build_players(parsedMessage.players)
        }

        if(this.messagetype == "ws_start_game"){    
          console.log('lets fucking gooo')
          this.build_players(parsedMessage.players)
          this.startCountdown(parsedMessage.average);
   
        }

        if(this.messagetype == "ws_reset_game"){    
          this.reset_ui()
          this.build_players(parsedMessage.players)

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

  subscribeToUsername(){
    this.storeService.username$.subscribe((data) => {
      if (this.username != data){
        //update players
        this.username = data;
        this.players.forEach((player: Player) => {
          if (player.user_id == this.user_id){
            player.username = this.username;
          }
        })

        //update websocket
        this.websocketService.sendMessage(JSON.stringify({
          message: "user-changes-username", 
          group_id: this.group_id,
          username: this.username,
          user_id: this.user_id
        }));
        
      }
      
      console.log('username changed: ', this.username);
    });
  }

  parseUrl(){
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let stringGID = urlParams.get('group_id');
      this.group_id = stringGID?.slice(0, -1);
    } catch (error) {}
  }

  getLocalStorage(){
    if (!this.group_id || this.group_id == 'undefined'){
      console.log('no group id')
      console.log('user_id: ', this.user_id)
      try {
        this.group_id = localStorage.getItem('group_id');
        let local_user = localStorage.getItem('user_id');

        if (local_user !== null && local_user !== 'null') {
          this.user_id = local_user;
        }
        console.log('user_id: ', this.user_id)
    
      }
      catch (error) {}

    } else {
      console.log('has group id')
      let local_user = localStorage.getItem('user_id');
      if (local_user !== null && local_user !== 'null') {
        this.user_id = local_user;
      }
    }
    this.storeService.updateUserId(this.user_id); 

    try{
      this.username = localStorage.getItem('username') || "Player";
    } catch (error) {}
  }

  setLocalStorage(){
    console.log('set local storage: ', this.group_id, this.user_id, this.username)
    localStorage.setItem('group_id', this.group_id);
    localStorage.setItem('user_id', this.user_id);
  }

  build_players(parsedPlayers:any){
    this.players = [];
    parsedPlayers.forEach((player: Player) => {
      const newPlayer: Player = { user_id: player.user_id, username: player.username, card: player.card };
      this.players.push(newPlayer);
    })
  }

  startCountdown(average:any): void {
    console.log('start countdown')
    clearInterval(this.countdownInterval);
    this.countdown = INITIAL_COUNTDOWN_VALUE;

    this.countdownInterval = setInterval(() => {
      // Update the countdown value
      this.countdown--;
      // Update the button label
      this.renderer.setProperty(
        this.buttonLabelElement,
        'textContent',
        `Showing in: ${this.countdown}`
      );

      // Check if the countdown reaches zero
      if (this.countdown <= 0) {
        // Perform actions when the countdown reaches zero
        this.stopCountdown(this.buttonLabelElement, average);
      }
    }, 1000); // Update the countdown every 1000 milliseconds (1 second)
  }

  stopCountdown(buttonLabelElement:any, average:any): void {
    // Stop the countdown and perform any additional actions
    clearInterval(this.countdownInterval);
    this.renderer.setProperty(buttonLabelElement, 'textContent', average);
    this.renderer.setStyle(buttonLabelElement, 'font-size', '2rem');

    const restartBtn = document.getElementById('restartBtn');
    restartBtn?.style.setProperty('display', 'block');
  }


  
  select_card(cardElement: HTMLElement, value: any){
    // remove selected class from previous card
    if (cardElement != this.selectedCardElement){
      try {
        this.selectedCardElement.classList.remove("scroll-selection-selected");
      } catch (error) {}
    } 
    // add selected class to new card
    this.selectedCardElement = cardElement;
    this.selectedCardElement.classList.add("scroll-selection-selected");
    
    // change button style
    if (this.buttonElement) {
      if (this.buttonLabelElement) {
        this.renderer.setProperty(this.buttonLabelElement, 'textContent', 'Waiting for other players...');
      }
    }
    this.buttonElement.disabled = false;
    this.gameStatus.style.backgroundColor = "rgb(0, 212, 51)";

    // send message to websocket
    this.websocketService.sendMessage(JSON.stringify({
      message: "user-card-selected",
      group_id: this.group_id,
      user_id: this.user_id, 
      card: value
    }));

  }

  changeUsername(userId: typeof uuidv4){
    if (userId === this.user_id) {
      const dialogRef = this.dialog.open(ModalChangeNameComponent, {
        data: { title: 'Change Username', username: this.username },
        width: '500px',
      });
    }
  }

  revealCards(){
    console.log("Reveal Cards");
  }
  resetCards(){
    console.log("Reset Cards");
    this.websocketService.sendMessage(JSON.stringify({
      message: "reset-game", 
    }));
  }

  reset_ui(){
    this.renderer.setStyle(this.buttonLabelElement, 'font-size', '14px');
    this.renderer.setProperty(this.buttonLabelElement, 'textContent', 'Pick youre Cards!');
    const restartBtn = document.getElementById('restartBtn');
    restartBtn?.style.setProperty('display', 'none');
    this.gameStatus.style.backgroundColor = "transparent";

    try {
      this.selectedCardElement.classList.remove("scroll-selection-selected");
    } catch (error) {}
  }


}
