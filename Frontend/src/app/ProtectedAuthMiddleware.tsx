import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useSession } from "./SessionProvider";

type Role = "admin" | "employer" | "jobseeker";

interface RouteConfig {
  [key: string]: {
    requiresAuth: boolean;
    allowedRoles?: Role[];
    redirectTo: string;
  };
}

const routeConfig: RouteConfig = {
  "/jobseeker": { requiresAuth: true, allowedRoles: ["jobseeker"], redirectTo: "/jobseeker/signin" },
  "/employer": { requiresAuth: true, allowedRoles: ["employer"], redirectTo: "/employer/signin" },
  "/admin": { requiresAuth: true, allowedRoles: ["admin"], redirectTo: "/admin/signin" },

  // Publicly accessible sign-in pages
  "/jobseeker/signin": { requiresAuth: false, redirectTo: "/jobseeker/profile" },
  "/employer/signin": { requiresAuth: false, redirectTo: "/employer/dashboard" },
  "/admin/signin": { requiresAuth: false, redirectTo: "/" },
};

export function useAuthProtection(currentPath: string) {
  const session = useSession();
  const router = useRouter();

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

  useQuery({
    queryKey: ["authProtection", currentPath, session],
    queryFn: async () => {
      const matchingRoute = Object.keys(routeConfig).find((route) => currentPath.startsWith(route));
      if (!matchingRoute) return null;

      const config = routeConfig[matchingRoute];

      // Redirect logged-in users trying to access any sign-in page to their role-specific pages
      if (session && currentPath.endsWith("/signin")) {
        switch (session.role) {
          case "jobseeker":
            router.replace("/jobseeker/profile");
            break;
          case "employer":
            router.replace("/employer/dashboard");
            break;
          case "admin":
            router.replace("/");
            break;
          default:
            break;
        }
        return null;
      }

      // Skip the toast and redirect if this is a public sign-in page and there is no active session
      if (!session && !config.requiresAuth) {
        return null;
      }

      // Redirect unauthenticated users if the page requires authentication
      if (config.requiresAuth && !session) {
        Toast.fire({
          icon: "error",
          title: "You must be signed in to access this page",
        });
        router.replace(config.redirectTo);
        return null;
      }

      // Check role-based access and restrict signed-in users to only their allowed pages
      if (config.allowedRoles && (!session || !config.allowedRoles.includes(session.role))) {
        Toast.fire({
          icon: "error",
          title: `You must be a ${config.allowedRoles[0]} to access this page`,
        });
        router.replace(config.redirectTo);
        return null;
      }

      return null;
    },
    enabled: !!currentPath,
    retry: false,
  });
}
