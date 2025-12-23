"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

function UpgradeInner() {
  const params = useSearchParams();
  const restricted = params.get("restricted") === "true";
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        {restricted && (
          <div className="text-center text-sm border border-red-300 bg-red-50 text-red-700 p-4 rounded-lg">
            Feature not available for free plan.{' '}
            <span
              className="underline cursor-pointer font-medium"
              onClick={() => router.push("/home/subscribe")}
            >
              Upgrade
            </span>{' '}
            your plan to get access.
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading...</div>}>
      <UpgradeInner />
    </Suspense>
  );
}
