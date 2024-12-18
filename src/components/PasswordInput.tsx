import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";

// 虽然麻烦了点，但是可以复用 收获还是蛮大的

// 这里的： React.forwardRef<HTMLInputElement,React.ComponentProps<"input">
// 参考了ui组件，所以这样填，因为要与他保持相同

// 获取本来要传给ui input的props，然后经过自己的组件，再传给ui
const MyPasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [isShowPass, setIsShowPass] = useState(false);
  return (
    <>
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          type={isShowPass ? "text" : "password"}
          className={cn(className)}
        ></Input>
        <button
          type="button"
          onClick={() => setIsShowPass(!isShowPass)}
          title={isShowPass ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {isShowPass ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    </>
  );
});
MyPasswordInput.displayName = "PasswordInput";

export { MyPasswordInput };
