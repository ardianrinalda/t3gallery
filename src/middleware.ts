import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, request) => {
  try {
    const session = await auth();

    if (isProtectedRoute(request) && !session.userId) {
      return Response.redirect(new URL('/sign-in', request.url));
    }
  } catch (err) {
    console.error('Middleware error:', err);
    return new Response('Internal error in middleware', { status: 500 });
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
