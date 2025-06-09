import z from 'zod';


export const createSchema = z.object({
    email: z.string().email()
})

export type CreateSchema = z.infer<typeof createSchema>

export const verifySchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
})

export const signUpSchema = z.object({
  authId: z.string().min(3),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}); 

export type LoginSchema = z.infer<typeof loginSchema>;
