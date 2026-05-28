import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Admin routes: no search engine indexing
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex,nofollow");
    return res;
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
