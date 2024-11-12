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
import Link from "next/link";
import { loginFormValidation, reigsterFormValidation } from "../../action/validation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { employerLoginService } from "../../authentication";

export default function Page() {
  const router = useRouter();
  const [isLogin, setLogin] = useState(true);
  const [isPending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  type logFormValues = z.infer<typeof loginFormValidation>;
  type regFormValues = z.infer<typeof reigsterFormValidation>;

  const form = useForm({
    resolver: zodResolver(isLogin ? loginFormValidation : reigsterFormValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      mobile: "",
      current_address: "",
      permanent_address: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const loginMutation = useMutation({
    mutationFn: employerLoginService,
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });

      // console.log("---------data----------", data);
      // window.location.href = "/";
      // window.location.reload();
      window.location.href = "/employer/dashboard";
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
      console.error("Login error:", data);
    },
  });
  const handleLogin = async (values: logFormValues) => {
    setPending(true);

    try {
      loginMutation.mutate(values);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setPending(false);
    }
  };

  const handleRegister = async (values: regFormValues) => {
    setPending(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      // console.log(response);
      if (response?.ok) {
        Toast.fire({
          icon: "success",
          title: "Account created successfully",
        });
        console.log("Account created successfully");
        setLogin(true);
        // print values
        console.log(values);
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Signup failed!",
      });
    } finally {
      setPending(false);
    }
  };

  const onSubmit = (values: logFormValues | regFormValues) => {
    if (isLogin) handleLogin(values as logFormValues);
    else handleRegister(values as regFormValues);
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

                  <p className=" text-gray-500 text-sm mt-2">Please enter your Employer credentials</p>
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
        <div className="  rounded-lg overflow-hidden  shadow-md p-8">
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
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>

                  <Input id="name" type="text" placeholder="John doe" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>

                  <Input id="mobile" type="text" placeholder="9812345678" {...register("mobile")} />
                  {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Current Address</Label>

                    <Input id="current_address" type="text" placeholder="Ktm, Nepal" {...register("current_address")} />
                    {errors.current_address && <p className="text-xs text-red-500">{errors.current_address.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Permanent Address</Label>

                    <Input id="permanent_address" type="text" placeholder="Ktm, Nepal" {...register("permanent_address")} />
                    {errors.permanent_address && <p className="text-xs text-red-500">{errors.permanent_address.message}</p>}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2 mb-10">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle input type
                  placeholder={isLogin ? "Enter password" : "Create password"}
                  {...register("password")}
                />
                <button
                  type="button" // Prevents form submission
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
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
              <div className="space-y-2 mb-10">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input id="password_confirmation" type={showPassword ? "text" : "password"} placeholder={"Confirm Password"} {...register("password_confirmation")} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation.message}</p>}
              </div>
            )}

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
            <Button disabled={isPending} type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
              {isPending ? (isLogin ? "Logging in..." : "Creating Account...") : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
