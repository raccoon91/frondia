import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReferenceSection = () => {
  return (
    <section className="grid grid-cols-3 gap-4 container max-w-5xl mx-auto py-30">
      <Card>
        <CardHeader>
          <CardTitle>Why Track Your Spending?</CardTitle>
        </CardHeader>
        <CardContent>
          Studies show that people who monitor their expenses regularly achieve their savings goals more easily.
          Understanding spending patterns leads to better financial decisions.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understand Your Spending Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          Analyzing your spending habits helps you cut unnecessary expenses and make better decisions for your goals.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Expenses is Not Just a Habit, It's a Strategy for Financial Freedom</CardTitle>
        </CardHeader>
        <CardContent>
          Recording and analyzing your expenses is the first strategic step toward achieving your financial goals.
        </CardContent>
      </Card>
    </section>
  );
};
