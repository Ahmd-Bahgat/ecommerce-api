import z from 'zod'

export const zUserSchema = z.object({
    firstName : z.string().min(2,'first name are required').max(100),
    lastName: z.string().min(2, 'last name are required').max(100),
    email: z.email(),
    password: z.string().min(6).max(225)
})
export type IUser = z.infer<typeof zUserSchema>
