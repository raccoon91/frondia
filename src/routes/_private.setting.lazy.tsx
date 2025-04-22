import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE, SETTING_FILE_ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

const SettingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );
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
    if (!transactionTypes.length) return [];

    const categoryMapByTypeId =
      categories?.reduce<Record<number, Category[]>>((categoryMap, category) => {
        if (!categoryMap[category.type_id]) categoryMap[category.type_id] = [];

        categoryMap[category.type_id].push(category);

        return categoryMap;
      }, {}) ?? {};

    return transactionTypes.map((type) => ({
      ...type,
      categories: categoryMapByTypeId?.[type.id] ?? [],
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
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <p className="font-bold">Setting</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex text-sm">
                <p className="w-[100px]">Email</p>
                <p>{user?.email ?? "-"}</p>
              </div>
              <div className="flex text-sm">
                <p className="w-[100px]">Register</p>
                <p>{user?.created_at ? dayjs(user.created_at).format("YYYY-MM-DD HH:mm") : null}</p>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <p className="font-bold">Logout</p>
                  <LogOut size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-[1fr_272px] gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Types And Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {typesAndCategories.map((type) => (
                <div key={type.id} className="flex flex-col gap-2">
                  <p className="text-sm font-bold">{type.name}</p>

                  {type.categories.length ? (
                    <div className="flex flex-wrap gap-2">
                      {type.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
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
                  <p className="text-sm">{`${currency.name} (${currency.symbol})`}</p>
                  <p className="text-sm">{currency.code}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(SETTING_FILE_ROUTE)({
  component: SettingPage,
});
