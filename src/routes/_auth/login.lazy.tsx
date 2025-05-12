import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingDot } from "@/components/ui/loading-dot";
import { Separator } from "@/components/ui/separator";
import { LOGIN_FILE_ROUTE, ROUTE } from "@/constants/route";
import { loginFormDefaultValues, loginFormSchema } from "@/schema/auth.schema";
import { useAuthStore } from "@/stores/auth.store";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoading, login, loginWithGoogle } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      login: state.login,
      loginWithGoogle: state.loginWithGoogle,
    })),
  );

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
  });

  const handleSubmitLogin = async (formdata: z.infer<typeof loginFormSchema>) => {
    const isSuccess = await login(formdata);

    if (isSuccess) {
      navigate({ to: ROUTE.DASHBOARD });
    } else {
      toast.warning("Login Failed!", {
        description: "Please check your email and password",
      });
    }
  };

  const handleSubmitLoginWithGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex lg:items-center lg:justify-center bg-muted ">
        <img src="/images/frondia.png" alt="frondia" className="max-w-2xs opacity-90" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmitLogin)}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel aria-required>Email</FormLabel>
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
                          <FormLabel aria-required>Password</FormLabel>
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

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Separator className="flex-1" />
                    <p className="text-sm text-muted-foreground">or continue with</p>
                    <Separator className="flex-1" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="relative justify-start p-1"
                    onClick={handleSubmitLoginWithGoogle}
                  >
                    <img src="/images/google_logo.svg" alt="google logo" className="w-auto h-full" />
                    <p className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 font-bold">
                      Google
                    </p>
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to={ROUTE.REGISTER} className="underline">
                    Sign up
                  </Link>
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
