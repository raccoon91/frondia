import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";

export const HeroSection = () => {
  const navigate = useNavigate();
  const getUser = useAuthStore((state) => state.getUser);

  const handleClickStart = async () => {
    const alreadyLogin = await getUser();

    if (alreadyLogin) {
      navigate({ to: ROUTE.DASHBOARD });
    } else {
      navigate({ to: ROUTE.LOGIN });
    }
  };

  return (
    <section className="flex flex-col items-center container mx-auto pt-50 pb-40">
      <h1 className="text-7xl">
        Record your <span className="text-primary">spending</span>
      </h1>
      <h1 className="text-7xl mt-2">
        and achieve your <span className="text-primary">goals</span>
      </h1>

      <p className="mt-10 text-lg">
        <span className="text-primary font-semibold">Snowball</span> helps you review your spending habits and set
        better financial goals.
      </p>

      <div className="mt-8">
        <Button variant="outline" onClick={handleClickStart}>
          Get Started <ArrowRight />
        </Button>
      </div>
    </section>
  );
};
