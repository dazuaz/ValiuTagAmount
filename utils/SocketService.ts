import io from 'socket.io-client';
import {Tag} from '../types';
import {fromEvent, Observable} from 'rxjs';
/**
 * Creates an Observable for each WebSocket event available on the server
 *
 * credits: https://github.com/rossbulat/ts-live-chat-demo/tree/master/client
 */
export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(): SocketService {
    console.log('initiating socket service');
    this.socket = io('ws://localhost:3000');
    return this;
  }

  // link addTag event to rxjs data source
  public onAddTag(): Observable<Tag> {
    return fromEvent(this.socket, 'ADD_TAG');
  }
  // link addTag event to rxjs data source
  public onModifyTag(): Observable<Tag> {
    return fromEvent(this.socket, 'MODIFY_TAG');
  }
  // link addTag event to rxjs data source
  public onRemoveTag(): Observable<string> {
    return fromEvent(this.socket, 'REMOVE_TAG');
  }

  // disconnect - used when unmounting
  public disconnect(): void {
    this.socket.disconnect();
  }
}
