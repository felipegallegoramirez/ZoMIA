import { Component, OnInit } from '@angular/core';
import { WebSocketService} from '../../services/web-socket.service'
import { PeerService } from '../../services/peer.service'


import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.component.html',
  styleUrls: ['./llamada.component.css']
})
export class LlamadaComponent implements OnInit {

  constructor(private socketsService:WebSocketService,private peerService:PeerService,private activatedRoute: ActivatedRoute) { }
    data:any =null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
      this.values.room= params['id'];
          this.checkMediaDevices();
          this.initIoConnection();
          this.initPeer();
    });
  }

  values={
    id: "",
    room: "",
  }
  ioConnection: any;



  private initIoConnection(): void {
    this.socketsService.join(this.values);

    this.ioConnection = this.socketsService.onVideo()
    .subscribe(callEnter => {
      if(callEnter.id!=this.values.id){
        this.sendCall(callEnter.id, this.currentStream);
        this.socketsService.joinRoom(this.values);
      }

    });
    
  }
  id:string=""
  initPeer ():void{
    const {peer} = this.peerService;

    //Abro el servidor con mi llamada
    peer.on('open', (id:any) => {
      this.id=id
      const body = {
        id: id,
        room: this.values.room,
      };
      
      this.socketsService.joinRoom(body);
    });


    peer.on('call', (callEnter:any) => {
      //Devolverle Mi stream
      callEnter.answer(this.currentStream);
      callEnter.on('stream', (streamRemote:any) => {
        this.addVideoUser2(streamRemote);
      });
    }, (err:any) => {
      console.log('*** ERROR *** Peer call ', err);
    });
    


  }

  currentStream:any;
  listUser: Array<any> = [];
  checkMediaDevices ():void {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {
      this.currentStream = stream;
      this.addVideoUser(stream);


    }).catch((e) => {
      console.log('*** ERROR *** Not permissions'+e);
    });

  }
  

  addVideoUser(stream: any) :void {
    let b =<HTMLVideoElement>document.querySelector("#a")
    b.srcObject =stream;
    b.volume=0;
  }

  addVideoUser2(stream: any) :void {
    let b =<HTMLVideoElement>document.querySelector("#b")
    b.srcObject =stream;
  }


  async sendCall (idPeer:any, stream:any): Promise<void> {
    var newUserCall = await this.peerService.peer.call(idPeer, stream);
    if (!!newUserCall) {
      newUserCall.on('stream', (userStream:any) => {
        this.addVideoUser2(userStream);
      })
    }
  }

}