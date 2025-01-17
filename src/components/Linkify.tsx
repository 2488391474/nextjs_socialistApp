import { match } from "assert";
import Link from "next/link";
import React from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

const Linkify = ({ children }: LinkifyProps) => {
  return (
    //
    <LinkifyUsername>
      <LinkifyHashTag>
        <LinkfyUrl>{children}</LinkfyUrl>
      </LinkifyHashTag>
    </LinkifyUsername>
  );
};

const LinkfyUrl = ({ children }: LinkifyProps) => {
  return (
    // 检测内容中的URL，并将其转为可点击的链接
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
};

//匹配内容中的用户名，使其变为一个可以点击的Link，并且返回完整数据
const LinkifyUsername = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/@[a-zA-z0-9-_]+/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip key={key} username={username}>
            {match}
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
};

//匹配内容中的Tag，使其变为一个可以点击的Link，并且返回完整数据
const LinkifyHashTag = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/#[a-zA-Z0-9]+/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
};

export default Linkify;
