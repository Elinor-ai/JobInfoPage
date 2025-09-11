import ABTestManager from "@/lib/ab/ABTestManager";
import { experiments } from "@/lib/ab/config";

const ab = new ABTestManager({ experiments });

export function middleware(request) {
  return ab.applyMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)"],
};
