import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReferenceSection = () => {
  return (
    <section className="grid grid-cols-3 gap-4 container max-w-5xl mx-auto py-30">
      <Card>
        <CardHeader>
          <CardTitle>왜 소비를 기록해야 할까요?</CardTitle>
        </CardHeader>
        <CardContent>
          연구에 따르면 지출을 정기적으로 모니터링하는 사람들은 더 쉽게 저축 목표를 달성합니다. 소비 패턴을 이해하면 더
          나은 재정 결정을 내릴 수 있습니다.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>당신의 소비 패턴을 이해하세요</CardTitle>
        </CardHeader>
        <CardContent>
          소비 습관을 분석하면 불필요한 지출을 줄이고, 목표 달성을 위한 더 나은 결정을 내릴 수 있습니다.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>소비 기록은 단순한 습관이 아닌,</CardTitle>
          <CardTitle>재정적 자유를 위한 전략입니다</CardTitle>
        </CardHeader>
        <CardContent>소비를 기록하고 분석하는 것은 당신의 목표 달성을 위한 전략적 첫걸음이 됩니다.</CardContent>
      </Card>
    </section>
  );
};
