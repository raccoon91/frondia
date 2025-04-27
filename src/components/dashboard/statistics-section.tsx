import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type FC, Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiProgress } from "@/components/ui/multi-progress";
import { ROUTE } from "@/constants/route";

interface StatisticsSectionProps {
  statistics: Statistics;
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ statistics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {statistics?.length ? (
          <table className="-mt-4">
            <tbody>
              {statistics.map(({ type, totalUsd, totalSummaries, categories }) => (
                <Fragment key={type.id}>
                  <tr>
                    <td className="text-left pt-4 align-top">
                      <p className="text-sm font-bold">{type.name}</p>
                    </td>

                    <td className="text-right pt-4 space-x-2">
                      {totalSummaries?.map(({ currency, totalAmount }) => (
                        <span
                          key={currency.id}
                          className="text-sm font-bold"
                        >{`${currency.code} : ${totalAmount.toLocaleString("en-US")}`}</span>
                      ))}
                    </td>

                    {/* <td className="pt-4 align-top">
                          <p className="text-sm font-bold text-right pl-4">Amount</p>
                        </td> */}

                    <td className="pt-4 align-top">
                      <p className="text-sm font-bold text-right pl-4">Rate</p>
                    </td>

                    <td className="pt-4 align-top">
                      <p className="text-sm font-bold text-right pl-4">Count</p>
                    </td>
                  </tr>

                  {categories?.map(({ category, currencies }) => (
                    <tr key={category.id}>
                      <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                        <p className="text-sm pl-6 pr-4">{category.name}</p>
                      </td>

                      <td className="pt-1 align-top">
                        <MultiProgress
                          data={currencies?.map(({ currency, transaction }) => ({
                            value: (transaction.usd / totalUsd) * 100,
                            label: `${currency.symbol} ${transaction.amount.toLocaleString("en-US")}`,
                          }))}
                        />
                      </td>

                      {/* <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                            {currencies?.map(({ currency, transaction }) => (
                              <p
                                key={currency.id}
                                className="text-sm text-right pl-4"
                              >{`${currency.symbol} ${transaction.amount.toLocaleString("en-US")}`}</p>
                            ))}
                          </td> */}

                      <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                        <p className="text-sm text-right pl-4">
                          {currencies
                            ?.reduce((totalRate, currency) => {
                              return totalRate + (currency.transaction.usd / totalUsd) * 100;
                            }, 0)
                            .toFixed(1) ?? "--"}{" "}
                          %
                        </p>
                      </td>

                      <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                        <p className="text-sm text-right pl-4">
                          {currencies?.reduce((totalCount, { transaction }) => {
                            return totalCount + transaction.count;
                          }, 0)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center py-12">
            <Button asChild size="sm" variant="ghost" className="font-semibold">
              <Link to={ROUTE.TRANSACTION}>
                Add your transaction
                <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
