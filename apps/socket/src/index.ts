import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { actionValidaor, addUserValidator, CreateMessageType, createMessageValidator } from './zod/actionValidation';
import { userManager } from './users/UserManager';
import { User } from './users/User';
import { prisma } from './lib/client';
import { messageManager } from './messages/MessageManager';
import { MessageType } from './types/MessageType';


dotenv.config()

const app = express();
app.use(cors())
app.use(express.json());

const httpServer = app.listen(8080);
const wss = new WebSocketServer({server: httpServer});

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async(event: string) => {
        const message = JSON.parse(event);
        const isValidAction = actionValidaor.safeParse(message);
        if(!isValidAction.success) return;
        const {action, payload} = isValidAction.data;
        
        if(action === 'add-user'){
            const {userId} = payload
            userManager.addUser(userId, ws);
            messageManager.updateAllMessagesToDelivered(userId);
            return;
        }

        if(action === 'send-message'){
            const data = payload;
            const response = await messageManager.sendMessage(data)
            if(response.success){
                const message = response.message as MessageType
                ws.send(JSON.stringify({
                    action: 'update-message-status',
                    payload: {
                        messageId: message.messageId,
                        messageStatus: message.messageStatus,
                        chatId: message.friendId
                    }
                }))
            }
            else{
                const message: string = response.message as string;
                ws.send(JSON.stringify({
                    action: 'send-message-error',
                    payload: {
                        messageId: data.messageId,
                    }
                }))
            }
            return;
        }
        if(action === 'update-all-message-status'){
            const {receiverId, friendId} = payload
            userManager.updateAllMessagesToSeen(receiverId, friendId)
        }

    });

    ws.on('close', () => {
        userManager.removeUser(ws);
    })

})
