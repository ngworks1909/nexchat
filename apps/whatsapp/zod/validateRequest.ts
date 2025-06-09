import { z } from "zod";

export const createRequestSchema = z.object({
    receiverId: z.string()
})