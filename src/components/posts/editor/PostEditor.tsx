"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PlaceHolder from "@tiptap/extension-placeholder";
import { submitPost } from "./action";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitPostMutation } from "./mutations";
import { LoadingButton } from "@/components/LoadingButton";

const PostEditor = () => {
  const { user } = useSession();

  //  使用@tiptap 文本编辑器
  const editor = useEditor({
    extensions: [
      //   禁用默认的加粗和斜体
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      //   没输入东西时 显示的占位数据
      PlaceHolder.configure({
        placeholder: "Write something...",
      }),
    ],
  });
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const mutation = useSubmitPostMutation();
  async function onSubmt() {
    // await submitPost({ content: input });
    // editor?.commands.clearContent();

    // 执行更新操作
    mutation.mutate(
      { content: input },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      }
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-5">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            className="hidden sm:inline"
          ></UserAvatar>
          <EditorContent
            editor={editor}
            className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-3"
          ></EditorContent>
        </div>
        <div className="flex justify-end">
          <LoadingButton
            onClick={onSubmt}
            loading={mutation.isPending}
            disabled={!input.trim()}
            className="min-w-20"
          >
            submit
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
