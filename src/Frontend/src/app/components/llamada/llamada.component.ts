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


  mediaRecorder: any;
  chunks: any[] = [];
  isRecording = false;


  private initIoConnection(): void {
    this.socketsService.join(this.values);

    this.socketsService.onVideo().subscribe(callEnter => {
      if(callEnter.id!=this.values.id){
        this.sendCall(callEnter.id, this.currentStream);
        this.socketsService.joinRoom(this.values);
      }
    });
    this.socketsService.onRecord().subscribe(callEnter => {
      console.log(callEnter)
      if(callEnter.id!=this.values.id){
        this.startRecordingR()
      }
    });
    this.socketsService.onRecord2().subscribe(callEnter => {
      if(callEnter.id!=this.values.id){
        this.stopRecordingR()
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
  checkMediaDevices(): void {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        this.currentStream = stream;
        this.addVideoUser(stream);

        this.mediaRecorder = new MediaRecorder(stream);
        console.log(this.mediaRecorder)
        this.mediaRecorder.addEventListener('dataavailable', (event:any) => {
          this.chunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.chunks); // Cambiado a tipo de audio MP3
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'audio_recording.mp3'; // Cambiado a extensión MP3
        a.click();
        window.URL.revokeObjectURL(url);
    });
  

  


      })
      .catch((e) => {
        // Manejar errores específicos
        console.error('*** ERROR *** Failed to obtain media permissions:', e);
        // Podrías mostrar un mensaje al usuario aquí pidiendo permisos
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


  startRecording() {
    const body = {
      id: this.id,
      room: this.values.room,
    };
    this.socketsService.Record(body);
    this.chunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
  }

  startRecordingR() {
    this.chunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
  }


  stopRecording() {
    const body = {
      id: this.id,
      room: this.values.room,
    };
    this.socketsService.Record2(body);
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  stopRecordingR() {

    this.mediaRecorder.stop();
    this.isRecording = false;
  }

}

