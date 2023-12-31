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

import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Renderer2, HostListener} from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { StoreService } from '../store.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModalChangeNameComponent } from '../modal-change-name/modal-change-name.component';
import { environment } from '../../environments/environment';
interface Player {
  user_id: typeof uuidv4;
  username: string;
  card?: number;
}
const INITIAL_COUNTDOWN_VALUE = 4;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕️'];
  // [0, 1/2, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕️']
  username: string = "Player";
  players: Player[] = [];
  selectedCardElement!: HTMLElement;
  gameStatus : any;
  group_id: any= null;
  user_id: any = uuidv4();
  countdown: number = 4; 
  countdownInterval: any;
  buttonElement: any;
  buttonLabelElement: any;
  wsOpen: boolean = false;
  userCanSelectCard: boolean = true;
  remove_group: boolean = false;
  urlParams: any;

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
    this.parseUrl();
    this.subscribeToListener()
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
        console.log('message: ', parsedMessage)
        //-----------------------------------------------------------------------
        if(this.messagetype == "ws-connection-established"){
          // check if url contains group_id
          if (!this.group_id || this.group_id){
            this.group_id = parsedMessage.group_id;
            this.localstorageSetGroupId(this.group_id);
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

        if(this.messagetype == "ws_update_group" || this.messagetype == "ws_waiting_for_players" || this.messagetype == "ws_user_leaves_group" || this.messagetype == "ws_user_update"){    
          console.log(parsedMessage)    
          this.build_players(parsedMessage.players)
        }

        if(this.messagetype == "ws_start_game"){    
          console.log('lets fucking gooo')
          console.log(parsedMessage)
          this.build_players(parsedMessage.players)
          this.userCanSelectCard =false
          this.startCountdown(parsedMessage.average);
   
        }

        if(this.messagetype == "ws_reset_game"){    
          this.reset_ui()
          this.build_players(parsedMessage.players)
          this.userCanSelectCard = true

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

  subscribeToListener(){
    this.storeService.wsOpen$.subscribe((data) => {
      this.wsOpen = data;
      this.handleWsOpen()
    })
    this.storeService.userId$.subscribe((data) => {
      this.user_id = data;
    })

    this.storeService.username$.subscribe((data) => {
      if (this.username != data){
        //update players
        this.username = data;

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

  handleWsOpen(){
    if (this.group_id == null && this.wsOpen){
      console.log('user has no group << ask ws for group')
      this.websocketService.sendMessage(JSON.stringify({
        message: "init-user", 
        group_id: 'default',
        username: this.username,
        user_id: this.user_id,
        card: null
      }));
    } else if (this.group_id != null && this.wsOpen){
      console.log('user has group << try joining group')
      this.websocketService.sendMessage(JSON.stringify({
        message: "init-user", 
        group_id: this.group_id,
        username: this.username,
        user_id: this.user_id,
        card: null
      }));
    }
  }

  localstorageSetGroupId(group_id:any){
    localStorage.setItem('group_id', group_id);
  }

  parseUrl(){
    try {
      this.urlParams = new URLSearchParams(window.location.search);
      let stringGID = this.urlParams.get('group_id');
      let group_param = stringGID?.slice(0, -1);
      console.log('parse url group id: ', group_param)

      if (group_param != null && group_param!= 'undefined'){
        console.log('set group id: ', group_param)
        this.group_id = group_param;
        this.localstorageSetGroupId(group_param); 
        this.storeService.updateGroupId(group_param);
      }

    } catch (error) {}
  }


  getLocalStorage(){  
    console.log('-----------------------------------')
    console.log('get local storage:')
    let local_group = localStorage.getItem('group_id');
    if (local_group != null) {
      console.log('group found in local storage')
      this.group_id = local_group;
      this.storeService.updateGroupId(this.group_id); 
    } else {
      console.log('no group found in local storage: ', this.group_id)

    }

    let local_user = localStorage.getItem('user_id');
    if (local_user !== null && local_user !== 'null' && local_user !== 'undefined') {
      this.user_id = local_user;
      this.storeService.updateUserId(this.user_id); 
      console.log('user found in local storage: ', this.user_id)
    } else {
      console.log('no user found in local storage: ', this.user_id)
      this.user_id = uuidv4();
      console.log('create uuid: ', this.user_id)
      this.storeService.updateUserId(this.user_id);
      localStorage.setItem('user_id', this.user_id);
    }
    
  
    try{
      this.username = localStorage.getItem('username') || "Player";
    } catch (error) {}

    console.log('-----------------------------------')

  }

  build_players(parsedPlayers:any){
    this.players = [];
    console.log('build players: ', parsedPlayers);
    Object.keys(parsedPlayers).forEach((key: string) => {
      const player: Player = parsedPlayers[key];
      const newPlayer: Player = { user_id: player.user_id, username: player.username, card: player.card };
      this.players.push(newPlayer);
    });
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
    this.showCards();

    const restartBtn = document.getElementById('restartBtn');
    restartBtn?.style.setProperty('display', 'block');
  }

  showCards(){
    const cardsClass = document.getElementsByClassName('player-cards-value');
    for (let i = 0; i < cardsClass.length; i++) {
      const element = cardsClass[i] as HTMLElement;
      element.style.setProperty('display', 'block');
    }
  }


  
  select_card(cardElement: HTMLElement, value: any){
    if (this.userCanSelectCard){
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


  }

  updateUser(userId: typeof uuidv4){
    if (!this.remove_group){
      console.log('change username')
      if (userId === this.user_id) {
        const dialogRef = this.dialog.open(ModalChangeNameComponent, {
          data: { title: 'Update User', username: this.username },
          width: '500px',
        });
      }
      console.log(this.username)
    }

  }

  removeGroup(userId: typeof uuidv4){
    this.remove_group = true
    console.log('remove group: ', this.group_id)

    this.websocketService.sendMessage(JSON.stringify({
      message: "user-leaves-group", 
      group_id: this.group_id,
      username: this.username,
      user_id: this.user_id
    }));

    if (this.urlParams.has('group_id')){
      const urlWithoutGroupId = window.location.href.replace(/[\?&]group_id=[^&]+/, '');
      window.history.replaceState({}, '', urlWithoutGroupId);
    }

    setTimeout(() => {
      this.websocketService.sendMessage(JSON.stringify({
        message: "init-user", 
        group_id: 'default',
        username: this.username,
        user_id: this.user_id,
        card: null
      }));
    }, 1000);



    setTimeout(() => {
      this.remove_group = false
    }, 1200);
    
  }

  revealCards(){
    console.log("Reveal Cards");
  }
  resetCards(){
    console.log("Reset Cards");
    this.websocketService.sendMessage(JSON.stringify({
      message: "reset-game",
      user_id: this.user_id,
      group_id: this.group_id, 
    }));
  }

  reset_ui(){
    this.renderer.setStyle(this.buttonLabelElement, 'font-size', '14px');
    this.renderer.setProperty(this.buttonLabelElement, 'textContent', 'Pick youre Cards!');
    const restartBtn = document.getElementById('restartBtn');
    restartBtn?.style.setProperty('display', 'none');
    this.gameStatus.style.backgroundColor = "#f0f8ff0d!important;";

    try {
      this.selectedCardElement.classList.remove("scroll-selection-selected");
    } catch (error) {}
  }




}
