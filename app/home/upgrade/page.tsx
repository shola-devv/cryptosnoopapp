"use client";
import { useRouter } from "next/navigation";
 
import { useSearchParams } from "next/navigation";

export default function UpgradePage() {
  const params = useSearchParams();
  const restricted = params.get("restricted") === "true";
  const router = useRouter();


  return (
    <div className="p-6 max-w-xl mx-auto">
      {restricted && (
        <div className="mb-4 text-sm border border-red-300 bg-red-50 text-red-700 p-3 rounded-lg">
          Feature not available for free plan.<span className="underline cursor-pointer" onClick={() => router.push("/home/subscribe")}> Upgrade </span>your plan to get access.
        </div>
      )}

   
      
      {/* Your upgrade pricing UI here */}

    </div>
  );
}
