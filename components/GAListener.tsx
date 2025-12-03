"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/analytic";

export default function GAListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) pageview(pathname);
  }, [pathname]);

  return null;
}
