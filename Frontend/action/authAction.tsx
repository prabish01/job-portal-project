"use server";

import * as z from "zod";
import { loginFormValidation } from "./validation";
import { signIn, signOut } from "../auth";

export const handleLoginAction = async (values: z.infer<typeof loginFormValidation>) => {
  const { email, password } = values;

  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
      // redirect: false,
    });
    return response;
  } catch (error: any) {
    console.log("Inside error");
    const msg = error.message.split(".")[0];
    return {
      error: true,
      message: msg,
    };
  }
};

export const handleLogoutAction = async () => {
  try {
    await signOut({
      redirectTo: "/signin",
    });
    return { success: true }; // return success signal
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
