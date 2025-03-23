import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { LOGIN_FILE_ROUTE, ROUTE } from "@/constants/route";
import { loginFormSchema } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { LoadingDot } from "@/components/ui/loading-dot";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoading, login } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      login: state.login,
    })),
  );

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitLogin = async (formdata: z.infer<typeof loginFormSchema>) => {
    const isSuccess = await login(formdata.email, formdata.password);

    if (isSuccess) navigate({ to: ROUTE.DASHBOARD });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex lg:items-center lg:justify-center bg-muted ">
        <img src="/images/snowball.png" alt="snowball image" className="max-w-2xs opacity-50" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form className={cn("flex flex-col gap-6")} onSubmit={form.handleSubmit(handleSubmitLogin)}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input type="email" autoFocus {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="relative">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      Login
                    </Button>

                    {isLoading ? (
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                        <LoadingDot />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account? <p className="inline-block underline underline-offset-4">Sign up</p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(LOGIN_FILE_ROUTE)({
  component: LoginPage,
});
