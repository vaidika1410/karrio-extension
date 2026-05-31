"use client";

import { useEffect, useState } from "react";

export function useExtension() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if already detected via dataset
    if (document.documentElement.dataset.karrioExtensionInstalled === "true") {
      setIsInstalled(true);
      return;
    }

    const handleDetected = () => {
      setIsInstalled(true);
    };

    window.addEventListener("karrio:extension-detected", handleDetected);

    // Trigger a check from the extension
    window.postMessage({ type: "KARRIO_CHECK_EXTENSION" }, window.origin);

    // Timeout if not detected within 1 second
    const timeout = setTimeout(() => {
      if (isInstalled === null) {
        setIsInstalled(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener("karrio:extension-detected", handleDetected);
      clearTimeout(timeout);
    };
  }, [isInstalled]);

  return { isInstalled };
}
