import { User } from "./User";
import {WebSocket} from 'ws'

export class UserManager{
    private onlineUsers: Map<string, User> = new Map();
    private static instance: UserManager;

    static getInstance(){
        if(UserManager.instance){
            return UserManager.instance;
        }
        UserManager.instance = new UserManager();
        return UserManager.instance;
    }

    public addUser(userId: string, ws: WebSocket){
        const user = new User(userId, ws);
        this.onlineUsers.set(userId, user);
    }

    public removeUser(socket: WebSocket){
        for (const [userId, user] of this.onlineUsers.entries()) {
            if (user.getSocket() === socket) {
                this.onlineUsers.delete(userId);
                break;
            }
        }
    }

    public getUser(userId: string){
        return this.onlineUsers.get(userId);
    }

    public updateAllMessagesToSeen(receiverId: string, friendId: string){
        const receiverSocket = this.getUser(receiverId)?.getSocket();
        if(receiverSocket){
            receiverSocket.send(JSON.stringify({
                action: 'update-all-message-status',
                payload: {
                    chatId: friendId
                }
            }))
        }
    }

}

export const userManager = UserManager.getInstance();