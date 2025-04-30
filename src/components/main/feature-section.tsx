import { type MouseEvent, useLayoutEffect, useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const FeatureSection = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const [focused, setFocused] = useState("monthly");
  const [image, setImage] = useState("/images/feature_1.png");
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
    const image = dataset.image;

    if (!focused || !image) return;

    setFocused(focused);
    setImage(`/images/${image}`);
  };

  return (
    <section className="container max-w-5xl mx-auto pt-20 pb-30">
      <h2 className="text-4xl">Manage Your Finances Smartly</h2>

      <p className="mt-4 text-lg">
        <span className="text-primary font-semibold">Frondia</span> is more than just a budget tracker.
      </p>
      <p className="text-lg">
        Easily record your expenses, set goals, and analyze data to make better financial decisions.
      </p>

      <div className="flex gap-4 mt-8">
        <div className="flex flex-col flex-3">
          <Card
            data-focused="monthly"
            data-image="feature_1.png"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "monthly" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">Monthly Expense Analysis</p>
              <p>Get a clear view of your monthly expenses! Analyze spending by category and identify patterns.</p>
            </CardContent>
          </Card>

          <Card
            data-focused="daily"
            data-image="feature_2.png"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "daily" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">Daily Spending Review</p>
              <p>How much did you spend today? Track your daily expenses to manage spending effectively.</p>
            </CardContent>
          </Card>

          <Card
            data-focused="tracking"
            data-image="feature_3.png"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "tracking" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">Goal Tracking</p>
              <p>Check your progress in real-time and improve your spending habits.</p>
            </CardContent>
          </Card>

          <Card
            data-focused="goal"
            data-image="feature_4.png"
            className={cn(
              "py-3 px-4 bg-background border-background shadow-none",
              focused === "goal" ? "bg-secondary border-secondary" : "",
            )}
            onMouseEnter={handleHoverFeature}
          >
            <CardContent className="flex flex-col gap-1 p-0">
              <p className="text-lg font-semibold">Customized Goals</p>
              <p>Set your own spending goals and improve your financial habits.</p>
            </CardContent>
          </Card>
        </div>

        <div ref={boxRef} className="relative flex-2">
          {position ? (
            <div
              className="overflow-hidden absolute top-0 left-0 right-0 rounded-tl-md"
              style={{
                width: position.width,
                height: position.height + 80,
                backgroundImage: `url(${image})`,
                backgroundSize: "auto 100%",
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};
