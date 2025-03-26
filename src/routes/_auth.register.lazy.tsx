import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { LOGIN_FILE_ROUTE, ROUTE } from "@/constants/route";
import { registerFormSchema } from "@/schema/auth.schema";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { LoadingDot } from "@/components/ui/loading-dot";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isLoading, register } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      register: state.register,
    })),
  );

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmitRegister = async (formdata: z.infer<typeof registerFormSchema>) => {
    const isSuccess = await register(formdata);

    if (isSuccess) {
      toast.success("Email sent successfully! Please check your inbox");

      navigate({ to: ROUTE.HOME });
    }
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
              <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmitRegister)}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">
                    Start <span className="text-primary font-bold">Snowball</span>
                  </h1>
                  <p className="text-sm">And save your money</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="gap-1">
                            <p>Email</p>
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" autoFocus {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="gap-1">User Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel className="gap-1">
                            <p>Password</p>
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="gap-1">
                            <p>Password Confirm</p>
                            <span className="text-destructive">*</span>
                          </FormLabel>
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
                      Register
                    </Button>

                    {isLoading ? (
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                        <LoadingDot />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to={ROUTE.LOGIN} className="underline">
                    Log in
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
  component: RegisterPage,
});
