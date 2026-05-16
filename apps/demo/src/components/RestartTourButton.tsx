"use client";

import { useOnboardBuddy } from "@prodypanda/onboardbuddy";

export function RestartTourButton({ tourId }: { tourId: string }) {
  const buddy = useOnboardBuddy();

  return (
    <button className="primary-button" type="button" onClick={() => buddy.reset(tourId)}>
      Restart onboarding
    </button>
  );
}
