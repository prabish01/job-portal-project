import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";
import { LogOut, SeparatorHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { get } from "http";
import getSession from "@/app/SessionProvider";

interface UserAccountNavProps {
  user: Pick<User, "email" | "name">;
  email?: string;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const getEmailInitials = (email: string) => {
    if (!email || email.trim() === "") return ""; // Check if email is undefined, null, or empty

    const firstLetter = email.charAt(0).toUpperCase(); // Get the first character and convert it to uppercase
    return firstLetter;
  };
  const handleLogout = async () => {
    localStorage.removeItem("session");
    window.location.reload();
    // router.push("/");
  };

  const initials = useMemo(() => getEmailInitials(user.email || ""), [user.email]);
  const session = getSession();
  return (
    <>
      <div className="relative rounded-full hover:ring-2 hover:ring-blue-500 transition-all    group">
        <Avatar className="cursor-pointer bg-gray-600 h-9 w-9">
          <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="absolute right-0 mt-4 w-48 rounded-md shadow-lg bg-white  ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="divide-y divide-slate-500 px-4 py-2">
            <div>
              <div className="px-4">{session?.data?.name}</div>
              <div className="px-4 mb-2 text-gray-400 text-xs">
                <p>{session?.data?.email}</p>
              </div>
            </div>
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Your Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Change Password
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Job Activity
              </a>
            </div>
            <div className=" w-full py-2">
              <form action={handleLogout}>
                <Button type="submit" variant="ghost" className="hover:bg-red-400 bg-gray-50 hover:text-white  text-end w-full  transition-all ">
                  <div className="flex items-center gap-5 justify-stretch flex-row">
                    <p>Logout</p>
                    <LogOut />
                  </div>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccountNav;
