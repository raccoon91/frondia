import { MouseEvent, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export const FeatureSection = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const [focused, setFocused] = useState("monthly");
  const [position, setPosition] = useState<Record<string, number> | null>(null);

  useLayoutEffect(() => {
    if (!boxRef.current) return;

    const resize = () => {
      const boxRect = boxRef.current?.getBoundingClientRect();

      if (!boxRect) return;

      setPosition({
        width: window.innerWidth - boxRect.x,
        height: boxRect.height,
      });
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleHoverFeature = (e: MouseEvent<HTMLDivElement>) => {
    const dataset = e.currentTarget.dataset;
    const focused = dataset.focused;

    if (!focused) return;

    setFocused(focused);
  };

  return (
    <section className="container max-w-5xl mx-auto pt-20 pb-30">
      <h2 className="text-4xl">당신의 금융을 스마트하게 관리하세요</h2>

      <p className="mt-4 text-lg">
        <span className="text-primary font-semibold">Snowball</span>은 단순한 가계부가 아닙니다.
      </p>
      <p className="text-lg">
        소비 내역을 쉽게 기록하고, 목표를 설정하며, 데이터를 분석하여 더 나은 재정 결정을 내릴 수 있도록 도와줍니다.
      </p>

      <div className="flex gap-4 mt-8">
        <div className="flex flex-col flex-3">
          <Card
            data-focused="monthly"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "monthly" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">이번 달 소비 분석</p>
              <p>한눈에 보는 월간 소비 내역! 카테고리별 지출을 분석하고 소비 패턴을 파악하세요.</p>
            </CardContent>
          </Card>

          <Card
            data-focused="daily"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "daily" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">하루 소비 점검</p>
              <p>오늘 얼마나 소비했나요? 매일 소비 내역을 정리하여 계획적인 지출을 도와드립니다.</p>
            </CardContent>
          </Card>

          <Card
            data-focused="goal"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "goal" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">맞춤형</p>
              <p>소비 목표 설정 원하는 목표를 설정하고, 소비 습관을 개선하세요.</p>
              <p>(예: "이번 달 식비 20% 줄이기")</p>
            </CardContent>
          </Card>

          <Card
            data-focused="tracking"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "tracking" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">목표 달성 트래킹 설정한</p>
              <p>목표를 얼마나 달성했는지 실시간으로 확인하고, 소비 습관을 바꿔보세요.</p>
            </CardContent>
          </Card>
        </div>

        <div ref={boxRef} className="relative flex-2">
          {position ? (
            <div
              className="absolute top-0 left-0 right-0 bg-secondary rounded-tl-md"
              style={{
                width: position.width,
                height: position.height + 80,
              }}
            ></div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
