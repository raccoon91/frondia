import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { REFERENCES } from "@/constants/reference";

export const ReferenceSection = () => {
  return (
    <section className="bg-secondary">
      <div className="flex flex-col gap-6 py-30">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-4xl">
            Why <span className="text-primary font-semibold">Frondia</span>
          </h2>
        </div>

        <Carousel opts={{ watchDrag: false, loop: true }}>
          <CarouselContent className="p-1">
            {REFERENCES.map((reference, index) => (
              <CarouselItem key={index} className="basis-sm">
                <Card className="select-none">
                  <CardHeader>
                    <CardTitle>{reference.title}</CardTitle>
                  </CardHeader>
                  <CardContent>{reference.content}</CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
