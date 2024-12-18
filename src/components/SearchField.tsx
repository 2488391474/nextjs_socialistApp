"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchField() {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; //获取整个form的元素
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    console.log(q, encodeURIComponent(q));
    //                      对特殊字符进行编码，防止特殊字符出现 如# @号
    router.push(`search?q=${encodeURIComponent(q)}`);
  };

  return (
    //        这里使用原生表单的提交效果，意为 “渐进式增强” 意味着当javascript无法运行时 此表单也照样能正常运行
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
