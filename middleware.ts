import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Get the pure hostname without the port
  const currentHost = hostname.split(":")[0];
  
  // Define your root domains
  const rootDomains = ["localhost", "127.0.0.1", "ecomsaas.com"];
  
  let domainIdentifier = "";

  // 1. Handle Subdomains on Root Domains
  if (currentHost.endsWith(".localhost")) {
    domainIdentifier = currentHost.replace(".localhost", "");
  } else if (currentHost.endsWith(".ecomsaas.com")) {
    domainIdentifier = currentHost.replace(".ecomsaas.com", "");
  } else if (!rootDomains.includes(currentHost)) {
    // 2. Handle COMPLETELY custom domains (e.g., www.mybrand.com)
    // We treat the whole hostname as the identifier
    domainIdentifier = currentHost;
  }

  // Debugging
  if (domainIdentifier && domainIdentifier !== "www" && domainIdentifier !== "app") {
    console.log(`[Middleware] Resolved Identifier: ${domainIdentifier}, Path: ${url.pathname}`);
  }

  // 3. Handle Routing
  if (domainIdentifier && domainIdentifier !== "www" && domainIdentifier !== "app") {
    // Skip middleware for assets and internal APIs
    if (
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/api") ||
      url.pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Rewrite to the dynamic tenant route: /[domain]/[path]
    url.pathname = `/${domainIdentifier}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
