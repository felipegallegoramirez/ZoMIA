import {EventEmitter, Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { Observable } from 'rxjs';;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService  extends Socket{
  events = ['new-user', 'bye-user'];
  cbEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super({
      url:"localhost:3000"
    })
  }


  join(a:any) {
    this.ioSocket.emit('join',a);
    }


      onVideo(): Observable<any> {
        return new Observable<any>(observer => {
          this.ioSocket.on('call', (data: any) => observer.next(data));
        });
        }

      joinRoom(mensaje:any) {
        this.ioSocket.emit('joinR',mensaje);
        }

        mirame(mensaje:any) {
          this.ioSocket.emit('mirame',mensaje);
          }

          miras(): Observable<any> {
            return new Observable<any>(observer => {
              this.ioSocket.on('miras', (data: any) => observer.next(data));
            });
            }

}
