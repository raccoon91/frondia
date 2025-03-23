import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";

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
        오늘부터 <span className="text-primary font-semibold">Snowball</span>과 함께
      </h2>
      <h2 className="mt-2 text-4xl">더 나은 소비 습관을 만들어 보세요!</h2>

      <div className="mt-12">
        <Button variant="outline" onClick={handleClickStart}>
          지금 시작하기 <ArrowRight />
        </Button>
      </div>
    </section>
  );
};
