import { createLazyFileRoute } from "@tanstack/react-router";

import { BottomSection } from "@/components/main/bottom-section";
import { FeatureSection } from "@/components/main/feature-section";
import { HeroSection } from "@/components/main/hero-section";
import { ReferenceSection } from "@/components/main/reference-section";
import { HOME_FILE_ROUTE } from "@/constants/route";

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      <FeatureSection />

      <ReferenceSection />

      <BottomSection />
    </div>
  );
};

export const Route = createLazyFileRoute(HOME_FILE_ROUTE)({
  component: HomePage,
});
