"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { resetPasswordValidation } from "../../../action/validation";
import { useForm } from "react-hook-form";
import { otpValidation, resetPassword, resetPasswordValidation } from "../../action/validation";
import { usePathname, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  //   const pathname = usePathname();

  const [isPending, setPending] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [isOtpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<string | null>(null);

  // -------------------------- reset from which verifies email --------------------------
  type ResetValues = z.infer<typeof resetPasswordValidation>;

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: ResetValues) => {
    console.log(values);
    setPending(true);
    try {
      const resetResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const resetResponseResult = await resetResponse.json();
      console.log("-=--=-=-=-=-=-=--=-=-=======-=-=-");
      console.log(resetResponse);
      if (resetResponseResult.success) {
        setOtpSent(true);
        return setSentMessage(resetResponseResult.message);
      } else {
        return setSentMessage(resetResponseResult.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = resetForm;

  // -------------------------- OTP verification form --------------------------

  type OtpValues = z.infer<typeof otpValidation>;
  const OtpValues = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = OtpValues;

  const verifyToken = async (token: string) => {
    try {
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const tokenResponseResult = await tokenResponse.json();
      console.log(tokenResponseResult);
      if (tokenResponseResult.success) {
        setNewToken(tokenResponseResult.data.token);
        setTokenValid(true);
      } else {
        console.log(tokenResponseResult.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOtpSubmit = async (otp: OtpValues) => {
    console.log("OTP submitted:", otp);
    try {
      const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otp),
      });
      const otpResponseResult = await otpResponse.json();
      console.log(otpResponseResult);
      if (otpResponseResult.success) {
        setToken(otpResponseResult.data.token);
        setTokenValid(true);

        await verifyToken(otpResponseResult.data.token);

        return setSentMessage("OTP verified successfully");
      } else {
        // custom message
        return setErrorMessage(otpResponseResult.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------- New Password form --------------------------

  type NewPasswordValues = z.infer<typeof resetPassword>;
  const newPasswordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const {
    register: registerNewPassword,
    handleSubmit: handleNewPasswordSubmit,
    formState: { errors: newPasswordErrors },
  } = newPasswordForm;

  const onNewPasswordSubmit = async (values: NewPasswordValues) => {
    console.log("New password submitted:", values);
    const payload = { ...values, token: newToken };

    try {
      const passwordResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const passwordResponseResult = await passwordResponse.json();
      console.log(passwordResponseResult);
      if (passwordResponseResult.success) {
        setSentMessage("Password changed successfully");
        setTokenValid(false);
        setNewToken(null);
        router.push("/signin");
      } else {
        setErrorMessage(passwordResponseResult.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (sentMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSentMessage(null);
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sentMessage, errorMessage]);
  return (
    <div className="min-h-screen gird place-content-center mx-auto">
      <div className="container w-2/4 p-16">
        <div className="grid grid-rows-2 mb-12 items-center justify-center">
          <h1 className="text-gray-800 text-center text-3xl mb-1 font-bold">{isTokenValid ? "Set New Password" : isOtpSent ? "Verify OTP" : "Reset Password"}</h1>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {/* {isOtpSent ? "Please enter the OTP sent to your email to proceed." : "Enter the email that you used to create the account, and we will send the reset link to your email."} */}
            {isTokenValid ? "Enter your new password below." : isOtpSent ? "Please enter the OTP sent to your email." : "Enter your email to receive the OPT and the reset link."}
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-md p-8">
          {isTokenValid ? (
            <form onSubmit={handleNewPasswordSubmit(onNewPasswordSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Enter new password" {...registerNewPassword("password")} />
                {newPasswordErrors.password && <p className="text-xs text-red-500">{newPasswordErrors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input id="password_confirmation" type="password" placeholder="Confirm new password" {...registerNewPassword("password_confirmation")} />
                {newPasswordErrors.password_confirmation && <p className="text-xs text-red-500">{newPasswordErrors.password_confirmation.message}</p>}
              </div>
              <Button disabled={isPending} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Reset Password
              </Button>
            </form>
          ) : isOtpSent ? (
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" type="text" placeholder="Enter OTP" {...registerOtp("otp")} />
                {otpErrors.otp && <p className="text-xs text-red-500">{otpErrors.otp.message}</p>}
              </div>
              <Button disabled={isPending} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Verify OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="text" placeholder="Enter your email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <Button disabled={isPending} type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                {isPending ? "Sending OTP" : "Reset Password"}
              </Button>
            </form>
          )}
          <div aria-live="polite">
            {sentMessage && <div className="text-center text-green-500 p-2 rounded-md">{sentMessage}</div>}
            {errorMessage && <div className="text-center text-red-500 p-2 rounded-md">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
