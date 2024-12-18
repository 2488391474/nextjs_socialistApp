import React from "react";
import Image from "next/image";
import { cn } from "../lib/utils";
import avatorPlaceHolder from "../assets/avatar-placeholder.png";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatorPlaceHolder}
      alt="Avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
};

export default UserAvatar;
