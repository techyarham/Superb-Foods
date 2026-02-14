import z from "zod";

export const verifyEmailZod=z.object({
    email:z.string().email(),
    otp:z.string().min(6," enter 6 numbers only").max(6," enter 6 numbers only")
})