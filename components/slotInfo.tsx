'use client'
import React from "react";

interface SlotInfoProps {
  used: number;
  max: number;
  isFree: boolean;
  onUpgrade?: () => void;
}

export function SlotInfo({ used, max, isFree, onUpgrade }: SlotInfoProps) {
  return (
    <div className="text-sm m-2">
      {isFree ? (
        <span>
          You have used {used}/{max} address slots{" "}
          <span
            className="cursor-pointer underline"
            onClick={onUpgrade}
          >
            Upgrade
          </span>{" "}
          to continue
        </span>
      ) : (
        <span>{used}/{max} slots used</span>
      )}
    </div>
  );
}
