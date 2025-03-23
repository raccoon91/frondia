import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";

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
      <h2 className="text-7xl">
        <span className="text-primary">소비</span>를 기록하고
      </h2>
      <h2 className="text-7xl mt-2">
        <span className="text-primary">목표</span>를 달성하세요
      </h2>

      <p className="mt-10 text-lg">
        <span className="text-primary font-semibold">Snowball</span>은 당신의 소비 습관을 돌아보고 더 나은 금융 목표를
        설정할 수 있도록 도와줍니다.
      </p>

      <div className="mt-8">
        <Button variant="outline" onClick={handleClickStart}>
          지금 시작하기 <ArrowRight />
        </Button>
      </div>
    </section>
  );
};
