"use client";

import { LoadingButton } from "../../../components/LoadingButton";
import { MyPasswordInput } from "../../../components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "./action";

export default function SignUpForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  // 只需要使用useForm
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    // 这里将其设置为低优先级任务是为了，获取isPending值，加上发送请求时不影响用户体验
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });
  }

  return (
    // 这里把useform的返回值作为props传给ui
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          // 这个controller很重要，他是连接表单和表单字段之间的联系
          // control 的核心作用是帮助 react-hook-form 管理字段状态（如值、校验和修改状态）。
          control={form.control}
          // 通过name props 指定该字段为username
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                {/* 官网写法： 我们想要自定义input样式，可以模仿他的写法，首先进入这个input框查看 */}
                {/* <Input placeholder="shadcn" {...field} /> */}
                {/*查看到: const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>( 
                发现只是将input框的ref向上传递了，所以我们可以在中间套一个自己的组件，然后再将这个ref同样的向上传递 */}
                {/* 把所有属性传给自定义input框 实现自定义样式框 */}
                <MyPasswordInput placeholder="Password" {...field} />
                {/* <PasswordInput></PasswordInput> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
