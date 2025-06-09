import { WebSocket } from "ws";

export class User{
    private userId: string
    private socket: WebSocket
    constructor(userId: string, socket: WebSocket){
        this.userId = userId;
        this.socket = socket;
    }
    getUserId(){
        return this.userId;
    }

    getSocket(){
        return this.socket
    }
}