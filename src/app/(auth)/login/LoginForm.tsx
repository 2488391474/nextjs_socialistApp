"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../../components/ui/input";
import { MyPasswordInput } from "../../../components/PasswordInput";
import { LoadingButton } from "../../../components/LoadingButton";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoginValue, loginSchema } from "../../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "./action";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<LoginValue>({
    resolver: zodResolver(loginSchema),
    // 这里要设置默认值，不设置默认值其input就默认为非受控组件
    // 然后该input被更新之后，会报一个将组件由非受控组件转为受控组件的报错
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValue) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <MyPasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={isPending} className="w-full">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LoginForm;
