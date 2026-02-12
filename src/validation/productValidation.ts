import z from 'zod'

export const zProductSchema = z.object({
    title: z.string().min(2,'title is required').max(200),
    image: z.string().min(1,'image is required'),
    price: z.number().min(0,'price is required'),
    stok: z.number().min(0,'stok is required').default(0),
})

export type IProduct = z.infer<typeof zProductSchema>