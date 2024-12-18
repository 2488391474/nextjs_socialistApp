import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("非法的邮箱"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "仅允许字母、数字、下划线和连字符"
  ),
  password: requiredString.min(8, "最少八个字符"),
});

// 使用类型推导工具，根据zod schema 自动推断出对象的类型
export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString.min(8, "最少八个字符"),
});

export type LoginValue = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
});

export type CreatePostValue = z.infer<typeof createPostSchema>;
