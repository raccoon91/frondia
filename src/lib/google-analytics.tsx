import { useEffect, useMemo } from "react";
import ReactGA from "react-ga4";

import { getCookie } from "@/utils/get-cookie";

const GATracker = () => {
  const excluded = useMemo(() => {
    const isDev = process.env.NODE_ENV === "development";

    return getCookie("exclude_me") === "true" || isDev;
  }, []);

  useEffect(() => {
    if (excluded) return;
    if (ReactGA.isInitialized) return;

    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
  }, [excluded]);

  useEffect(() => {
    if (excluded) return;

    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, [excluded, window.location.pathname]);

  return null;
};

export default GATracker;
