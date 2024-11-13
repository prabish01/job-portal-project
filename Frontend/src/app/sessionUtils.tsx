// // sessionUtils.js
// export function fetchSession() {
//   if (typeof window !== "undefined") {
//     // We're in the browser
//     const sessionData = localStorage.getItem("session");
//     return sessionData ? JSON.parse(sessionData) : null;
//   }
//   // Return null if not in the browser (e.g., during SSR)
//   return null;
// }
