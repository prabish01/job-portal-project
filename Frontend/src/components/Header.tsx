"use client";

import React from "react";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { auth } from "../../auth";
import { handleLogoutAction } from "../../action/authAction";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import UserAccountNav from "./UserAccountNav";
import { User } from "next-auth";

interface HeaderProps {
  session: any;
  user: Pick<User, "email" | "name">;
}

export const Header = ({ user, session }: HeaderProps) => {
  return (
    <>
      <header className="border-b">
        <div className="container max-w-8xl">
          <nav className="flex items-center justify-between align-middle h-16">
            <Link href="/">
              <div className="textWrapper">
                <p className="text-xl font-bold">Job Portal</p>
                <div className="invertbox"></div>
              </div>
            </Link>

            <ul className="flex space-x-16">
              <li className="relative  hover:text-blue-500 transition-all    group">
                <a href="#" className="text-sm flex items-center h-16 hover:text-blue-500 transition-colors">
                  Job Category
                  <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      IT Jobs
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Engineering Jobs
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Marketing Jobs
                    </a>
                  </div>
                </div>
              </li>
              <li className="relative hover:text-blue-500 group">
                <a href="#" className="text-sm flex items-center h-16 hover:text-blue-500 transition-colors">
                  Services
                  <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Resume Writing
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Career Counseling
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Job Alerts
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a href="#" className="text-sm flex items-center h-16 hover:text-blue-500 transition-colors">
                  Vacancies
                </a>
              </li>
              <li>
                <a href="#" className="text-sm flex items-center h-16 hover:text-blue-500 transition-colors">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm flex items-center h-16 hover:text-blue-500 transition-colors">
                  About us
                </a>
              </li>
            </ul>

            {session ? (
              <>
                <div>
                  <UserAccountNav
                    user={{
                      email: user.email,
                      name: user.name,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="default" className="bg-blue-500 hover:bg-blue-600 transition-colors">
                    <span className="mr-2">
                      <LogIn />
                    </span>{" "}
                    Login
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};
