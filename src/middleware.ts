import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    // ✅ Nothing else needed here
    // Clerk will automatically block unauthenticated users from matching routes
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
