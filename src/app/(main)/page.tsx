import PostEditor from "@/components/posts/editor/PostEditor";
import React from "react";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
const Page = async () => {
  return (
    <main className="h-[200vh] w-full flex">
      <div className="w-full min-w-0 space-y-5 mr-[50px]">
        <PostEditor></PostEditor>
        {/* <ForYouFeed></ForYouFeed> */}

        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
