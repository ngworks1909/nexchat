
import z from 'zod';

export const addUserValidator = z.object({
    userId: z.string(),
})

export const createMessageValidator = z.object({
    messageId: z.string(),
    senderId: z.string(),
    friendId: z.string(),
    message: z.string().min(1),
    messageType: z.enum(['text', 'image', 'video', 'audio']),
});

export const updateMessageStatusValidator = z.object({
    messageId: z.string(),
    messageStatus: z.enum(['Sent', 'Delivered', 'Seen']),
})

export const updateAllMessageStatusValidator = z.object({
    receiverId: z.string(),
    friendId: z.string(),
})


export const actionValidaor = z.discriminatedUnion('action', [
    z.object({
        action: z.literal('add-user'),
        payload: addUserValidator
    }),
    z.object({
        action: z.literal('send-message'),
        payload: createMessageValidator,
    }),
    z.object({
        action: z.literal('update-all-message-status'),
        payload: updateAllMessageStatusValidator,
    }),
])
// update-all-message-status

export type CreateMessageType = z.infer<typeof createMessageValidator>
