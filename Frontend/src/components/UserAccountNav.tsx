import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";
import { LogOut, SeparatorHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { get } from "http";
import { useSession } from "@/app/SessionProvider";

const UserAccountNav = () => {
  const session = useSession();
  const getEmailInitials = () => {
    if (!session?.data?.email || session.data.email.trim() === "") return "";
    return session.data.email.charAt(0).toUpperCase();
  };

  const initials = useMemo(() => getEmailInitials(), [session?.data?.email]);

  const profileUrl = session?.role === "admin" ? "/admin/dashboard" : session?.role === "employer" ? "/employer/profile" : "/jobseeker/view-profile";
  const dashboardUrl = session?.role === "admin" ? "/admin/dashboard" : session?.role === "employer" ? "/employer/dashboard" : "/jobseeker/dashboard";
  const createProfileUrl = session?.role === "admin" ? "/admin/dashboard" : session?.role === "employer" ? "/employer/profile/create-profile" : "/jobseeker/createprofile";
  const handleLogout = async () => {
    localStorage.removeItem("session");
    window.location.reload();
    window.location.href = "/";
    // router.push("/");
  };

  // const initials = useMemo(() => getEmailInitials(session.data.email || ""), [session.data.email]);
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
              <a href={profileUrl} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                View Profile
              </a>
              {session?.role === "employer" && (
                <a href={dashboardUrl} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Dashboard
                </a>
              )}

              <a href={createProfileUrl} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Create Profile
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
