export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect all /admin routes except the login page itself
  matcher: ["/admin/((?!login).*)"],
};
