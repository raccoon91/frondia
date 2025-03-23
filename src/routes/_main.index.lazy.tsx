import { createLazyFileRoute } from "@tanstack/react-router";

import { HOME_FILE_ROUTE } from "@/constants/route";
import { HeroSection } from "@/components/main/hero-section";
import { FeatureSection } from "@/components/main/feature-section";
import { ReferenceSection } from "@/components/main/reference-section";
import { BottomSection } from "@/components/main/bottom-section";

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
