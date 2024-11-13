// // hooks/useAuthProtection.ts
// import { useSession } from "./useSession";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import Swal from "sweetalert2";

// const Toast = Swal.mixin({
//   toast: true,
//   position: "top-end",
//   showConfirmButton: false,
//   timer: 1000,
//   timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.addEventListener("mouseenter", Swal.stopTimer);
//     toast.addEventListener("mouseleave", Swal.resumeTimer);
//   },
// });

// type Role = "admin" | "employer" | "jobseeker";

// interface RouteConfig {
//   [key: string]: {
//     requiresAuth: boolean;
//     allowedRoles?: Role[];
//     redirectTo: string;
//     signInPath: string;
//   };
// }

// const routeConfig: RouteConfig = {
//   "/admin": {
//     requiresAuth: true,
//     allowedRoles: ["admin"],
//     redirectTo: "/admin/signin",
//     signInPath: "/admin/signin",
//   },
//   "/employer": {
//     requiresAuth: true,
//     allowedRoles: ["employer"],
//     redirectTo: "/employer/signin",
//     signInPath: "/employer/signin",
//   },
//   "/jobseeker": {
//     requiresAuth: true,
//     allowedRoles: ["jobseeker"],
//     redirectTo: "/jobseeker/signin",
//     signInPath: "/jobseeker/signin",
//   },
// };

// export function useAuthProtection(currentPath: string) {
//   const session = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = () => {
//       // Find matching route configuration
//       const matchingRoute = Object.keys(routeConfig).find((route) => currentPath.startsWith(route));

//       if (!matchingRoute) return; // No protection needed for this route

//       const config = routeConfig[matchingRoute];

//       // Handle signed-in users trying to access sign-in pages
//       if (session && currentPath.endsWith("/signin")) {
//         switch (session.role) {
//           case "jobseeker":
//             router.replace("/jobseeker/profile");
//             return;
//           case "employer":
//             router.replace("/employer/dashboard");
//             return;
//           case "admin":
//             router.replace("/");
//             return;
//         }
//       }

//       // Check if authentication is required
//       if (config.requiresAuth && !session) {
//         Toast.fire({
//           icon: "error",
//           title: `You must be signed in to access this page`,
//         });
//         router.replace(config.redirectTo);
//         return;
//       }

//       // Check role-based access
//       if (config.allowedRoles && (!session || !config.allowedRoles.includes(session.role))) {
//         Toast.fire({
//           icon: "error",
//           title: `You must be a ${config.allowedRoles[0]} to access this page`,
//         });
//         router.replace(config.redirectTo);
//         return;
//       }
//     };

//     checkAuth();
//   }, [currentPath, session, router]);
// }

// // components/AuthProtection.tsx
// import { ReactNode } from "react";
// import { usePathname } from "next/navigation";
// import { useAuthProtection } from "../hooks/useAuthProtection";

// interface AuthProtectionProps {
//   children: ReactNode;
// }

// export function AuthProtection({ children }: AuthProtectionProps) {
//   const pathname = usePathname();
//   useAuthProtection(pathname);

//   return <>{children}</>;
// }

// // app/layout.tsx
// import { AuthProtection } from "../components/AuthProtection";
// import { Providers } from "./providers";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html>
//       <body>
//         <Providers>
//           <AuthProtection>{children}</AuthProtection>
//         </Providers>
//       </body>
//     </html>
//   );
// }
