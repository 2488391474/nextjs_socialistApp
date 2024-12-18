import React from "react";
import { validateRequest } from "../../auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "./NavBar";
import MenuBar from "./MenuBar";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();
  if (!session.user) redirect("/login");

  return (
    <>
      <SessionProvider value={session}>
        <div className="flex min-h-screen flex-col">
          <NavBar />

          <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5s">
            <MenuBar className=" bg-red sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl  px-3 py-5 shadow-sm  sm:block lg:px-5 xl:w-80"></MenuBar>
            {children}
          </div>
        </div>
        <MenuBar className="fixed bottom-0 left-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden"></MenuBar>
      </SessionProvider>
    </>
  );
};

export default Layout;
