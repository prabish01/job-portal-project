"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordValidation } from "../../../action/validation";
import { useForm } from "react-hook-form";

export default function Page() {
  const [isPending, setPending] = useState();

  type ResetValues = z.infer<typeof resetPasswordValidation>;

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = resetForm;

  const onSubmit = (values: ResetValues) => {
    console.log(values);
  };
  return (
    <div className="min-h-screen gird place-content-center mx-auto">
      <div className="container w-2/4 p-16 ">
        <div className="flex mb-12 items-center justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-800 text-center text-3xl mb-1">
              <p className="font-bold">Reset password</p>

              <p className=" text-gray-500 text-sm mt-2">Enter the email that you used to create the account and we will send teh reset link to the email</p>
            </h1>
          </div>
        </div>
        <div className="  rounded-lg overflow-hidden h-[200px] shadow-md p-8">
          <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-5 " method="POST">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <Button type="submit" className=" w-full bg-green-500 hover:bg-green-600 text-white">
                  {isPending ? "Sending link" : "Reset password"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
