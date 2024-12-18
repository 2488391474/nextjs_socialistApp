"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import Comments from "../comments/Comments";
// import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
// import UserTooltip from "../UserTooltip";
// import BookmarkButton from "./BookmarkButton";
// import LikeButton from "./LikeButton";
// import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <>
      <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        {post.content}
      </article>
    </>
  );
}
