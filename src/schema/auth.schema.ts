import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

export const loginFormDefaultValues = {
  email: "",
  password: "",
};

export const registerFormSchema = z
  .object({
    email: z.string().email().nonempty(),
    name: z.string(),
    password: z.string().min(6).max(20),
    passwordConfirm: z.string().min(6).max(20),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const registerFormDefaultValues = {
  email: "",
  name: "",
  password: "",
  passwordConfirm: "",
};
