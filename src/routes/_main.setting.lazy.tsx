import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { ROUTE, SETTING_FILE_ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useShallow } from "zustand/shallow";
import { useEffect, useMemo } from "react";

const SettingPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { currencies, transactionTypes, categories, getCurrencies, getTransactionTypes, getCategories } =
    useTransactionOptionStore(
      useShallow((state) => ({
        currencies: state.currencies,
        transactionTypes: state.transactionTypes,
        categories: state.categories,
        getCurrencies: state.getCurrencies,
        getTransactionTypes: state.getTransactionTypes,
        getCategories: state.getCategories,
      })),
    );

  const typesAndCategories = useMemo(() => {
    if (!transactionTypes.length || !categories.length) return [];

    const categoryMapByTypeId = categories.reduce<Record<number, Category[]>>((acc, cur) => {
      if (!acc[cur.type_id]) acc[cur.type_id] = [];

      acc[cur.type_id].push(cur);

      return acc;
    }, {});

    return transactionTypes.map((type) => ({
      ...type,
      categories: categoryMapByTypeId[type.id],
    }));
  }, [transactionTypes, categories]);

  useEffect(() => {
    getCurrencies();
    getTransactionTypes();
    getCategories();
  }, []);

  const handleLogout = async () => {
    const isSuccess = await logout();

    if (isSuccess) navigate({ to: ROUTE.LOGIN });
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout}>
            <p className="font-bold">Logout</p>
            <LogOut size={20} />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Types And Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {typesAndCategories.map((type) => (
            <div key={type.id}>
              <p>{type.name}</p>

              {type.categories.length ? (
                <div className="flex flex-wrap gap-2">
                  {type.categories.map((category) => (
                    <div key={category.id} className="ml-4">
                      <p>{category.name}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currencies</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {currencies.map((currency) => (
            <div key={currency.id} className="flex justify-between">
              <p>{`${currency.name} (${currency.symbol})`}</p>
              <p>{currency.code}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createLazyFileRoute(SETTING_FILE_ROUTE)({
  component: SettingPage,
});
