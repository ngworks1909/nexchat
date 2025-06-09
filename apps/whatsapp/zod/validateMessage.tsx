import z from 'zod'

export const createMessageValidator = z.object({
    friendId: z.string()
})