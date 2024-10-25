"use client";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { formValidation } from "../../../action/validation";
import Link from "next/link";

export default function Page() {
  const [isLogin, setLogin] = useState(true);

  type FormValues = z.infer<typeof formValidation>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen gird place-content-center mx-auto">
      <div className="container w-2/4 p-16 ">
        {/* toogle button */}
        <div className="flex mb-12 items-center justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-800 text-center text-3xl mb-1">
              {isLogin ? (
                <>
                  <p className="font-bold">Welcome to Job Portal</p>

                  <p className=" text-gray-500 text-sm mt-2">Please enter your credentials</p>
                </>
              ) : (
                <>
                  <p className="font-bold">Create an Account</p>
                  <p className=" text-gray-500 text-sm mt-2">Fill out the form below to signup </p>
                </>
              )}
            </h1>
          </div>
        </div>
        <div className="  rounded-lg overflow-hidden h-[600px] shadow-md p-8">
          <div className="bg-gray-100 h-[4rem] rounded-full relative mb-10">
            <motion.div className="absolute shadow-md  m-1 inset-y-1 w-1/2 bg-white rounded-full" initial={false} animate={{ x: isLogin ? "2%" : "95%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            <div className="grid grid-cols-2 gap-10 m-2 relative z-10">
              <button className={`w-full tracking-wider py-5 text-sm font-medium rounded-full transition-colors relative z-10, ${isLogin ? "text-black" : "text-gray-400"}`} onClick={() => setLogin(true)}>
                Log In
              </button>
              <button className={`w-full tracking-wider py-5  text-center text-sm font-medium rounded-full transition-colors relative z-10, ${!isLogin ? "text-black" : "text-gray-400"}`} onClick={() => setLogin(false)}>
                Sign Up
              </button>
            </div>
          </div>

          {/* form */}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 " method="POST">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            {isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>

                  <Input id="username" type="text" placeholder="Enter your username" {...register("username")} />
                  {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                </div>
              </>
            )}
            <div className="space-y-2 mb-10">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder={isLogin ? "Create password" : "Enter password"} {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

              {isLogin && (
                <>
                  <div className="text-gray-400 hover:text-red-400 transition-colors hover:underline hover:underline-offset-2 -mt-2">
                    <Link href="/resetPassword">
                      <Label>forgot password</Label>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="w-full mt-5 mb-5">
                  <div className="flex flex-row  items-center justify-around gap-5">
                    <div className=" flex flex-row items-center gap-5">
                      <p>Job Seeker</p>
                      <div className="relative flex flex-col h-[50px] w-[50px] items-center justify-center">
                        <input type="radio" id="radio" name="role" value="jobSeeker" className="peer z-10 h-full w-full cursor-pointer opacity-0" />
                        <div className="absolute h-5 w-5 rounded-full bg-teal-100 p-4 shadow-sm shadow-[#00000050] ring-teal-400 duration-300 peer-checked:scale-110 peer-checked:ring-2"></div>
                        <div className="absolute -z-10 h-full w-full scale-0 rounded-full bg-teal-100 duration-500 peer-checked:scale-[1500%]"></div>
                      </div>
                    </div>
                    <div className=" flex flex-row items-center gap-5">
                      <div className="relative flex h-[50px] w-[50px] items-center justify-center">
                        <input type="radio" id="radio" name="role" value="jobProvider" className="peer z-10 h-full w-full cursor-pointer opacity-0" />
                        <div className="absolute h-5 w-5 rounded-full bg-orange-100 p-4 shadow-sm shadow-[#00000050] ring-orange-400 duration-300 peer-checked:scale-110 peer-checked:ring-2"></div>
                        <div className="absolute -z-10 h-full w-full scale-0 rounded-full bg-orange-200 duration-500 peer-checked:scale-[1500%]"></div>
                      </div>
                      <p>Job Provider</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <Button type="submit" className=" w-full bg-green-500 hover:bg-green-600 text-white">
              {isLogin ? "Create Account" : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
