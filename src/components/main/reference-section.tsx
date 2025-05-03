import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReferenceSection = () => {
  return (
    <section className="bg-secondary">
      <div className="grid grid-cols-3 gap-4 container max-w-5xl mx-auto pt-40 py-30">
        <Card>
          <CardHeader>
            <CardTitle>Why Track Your Spending?</CardTitle>
          </CardHeader>
          <CardContent>
            People who regularly monitor their expenses are more likely to reach their savings goals. Awareness of where
            your money goes is the first step toward financial control.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Know Your Spending Habits</CardTitle>
          </CardHeader>
          <CardContent>
            Spot trends, identify leaks, and cut unnecessary costs. When you understand your spending, better choices
            follow naturally.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turn Tracking Into a Saving Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            Expense tracking isn’t just a routine — it’s a proven strategy to achieve financial freedom, one decision at
            a time.
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
