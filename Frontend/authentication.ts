import { loginFormValidation } from "./action/validation";
import * as z from "zod";

// services/auth-service.js
export const adminLoginService = async (credentials: z.infer<typeof loginFormValidation>) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    console.log(data);

    localStorage.setItem("session", JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};
export const employerLoginService = async (credentials: z.infer<typeof loginFormValidation>) => {
  try {
    console.log("inside try");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    console.log(data);

    // Store session
    localStorage.setItem("session", JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};

export const jobSeekerLoginService = async (credentials: z.infer<typeof loginFormValidation>) => {
  try {
    console.log("inside try");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    console.log(data);

    // Store session
    localStorage.setItem("session", JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};
// export const employerCreateJob = async (credentials: z.infer<typeof loginFormValidation>) => {

//   try {
//     console.log("inside try");
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/store`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Login failed");
//     }

//     const data = await response.json();
//     console.log(data);

//     // Store session
//     localStorage.setItem("session", JSON.stringify(data));
//     return data;
//   } catch (error: any) {
//     throw new Error(error.message || "Login failed");
//   }
// };
