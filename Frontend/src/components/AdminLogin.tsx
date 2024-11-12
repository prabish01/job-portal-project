"use client";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginFormValidation, reigsterFormValidation } from "../../action/validation";
import { useRouter } from "next/navigation";
import { handleLoginAction } from "../../action/authAction";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { adminLoginService } from "../../authentication";

export default function AdminLogin() {
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
  // type regFormValues = z.infer<typeof reigsterFormValidation>;

  const form = useForm({
    resolver: zodResolver(loginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const loginMutation = useMutation({
    mutationFn: adminLoginService,
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      console.log("---------data----------", data);
      // window.location.href = "/";
      router.push("/");
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
    }

    // try {
    //   const response = await handleLoginAction(values);
    //   console.log({ response });
    //   if (response.error) {
    //     Toast.fire({
    //       icon: "error",
    //       title: `${response.message}`,
    //     });
    //   }
    //   Toast.fire({
    //     icon: "success",
    //     title: "Signed in successfully",
    //   });
    //   router.refresh();
    //   router.push("/");
    //   router.refresh();
    // } catch (error: any) {
    //   Toast.fire({
    //     icon: "error",
    //     title: `${error.message}`,
    //   });
    // } finally {
    //   setPending(false);
    // }
  };

  // const onSubmit = async (values: logFormValues) => {
  //   setPending(true);
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(values),
  //     });
  //     console.log(response);
  //     if (response?.ok) {
  //       Toast.fire({
  //         icon: "success",
  //         title: "Account created successfully",
  //       });
  //       console.log("Account created successfully");
  //       // setLogin(true);
  //       // print values
  //       console.log(values);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Toast.fire({
  //       icon: "error",
  //       title: "Signup failed!",
  //     });
  //   } finally {
  //     setPending(false);
  //   }
  // };

  const onSubmit = (values: logFormValues) => {
    if (isLogin) handleLogin(values as logFormValues);
    else handleLogin(values as logFormValues);
  };

  return (
    <div className="min-h-screen gird place-content-center mx-auto">
      <div className="container w-2/4 p-16 ">
        {/* toogle button */}
        <div className="flex mb-12 items-center justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-800 text-center text-3xl mb-1">
              <>
                <p className="font-bold">Admin Portal - Job Portal</p>

                <p className=" text-gray-500 text-sm mt-2">Please enter your Admin credentials</p>
              </>
            </h1>
          </div>
        </div>
        <div className="  rounded-lg overflow-hidden  shadow-md p-8">
          {/* form */}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 " method="POST">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
            </div>

            <div className="space-y-2 mb-10">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input type="password" placeholder="********" id="password" {...register("password")} />
                <button
                  type="button" // Prevents form submission
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

              <div className="text-gray-400 hover:text-red-400 transition-colors hover:underline hover:underline-offset-2 -mt-2">
                <Link href="/resetPassword">
                  <Label>forgot password</Label>
                </Link>
              </div>
            </div>

            <Button disabled={isPending} type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
              {isPending ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
