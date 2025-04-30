import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";

export const BottomSection = () => {
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
    <section className="flex flex-col items-center mx-auto pt-30 pb-60">
      <h2 className="text-4xl">
        Start Today with <span className="text-primary font-semibold">Frondia</span>
      </h2>
      <h2 className="mt-2 text-4xl">and Build Better Spending Habits!</h2>

      <div className="mt-12">
        <Button variant="outline" onClick={handleClickStart}>
          Get Started <ArrowRight />
        </Button>
      </div>
    </section>
  );
};
