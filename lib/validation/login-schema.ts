import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
