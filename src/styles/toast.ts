import { createStandaloneToast } from "@chakra-ui/react";

const { ToastContainer, toast: baseToast } = createStandaloneToast();

const toast = {
  info: (message: string) =>
    baseToast({
      title: message,
      status: "info",
      position: "top",
    }),
  success: (message: string) =>
    baseToast({
      title: message,
      status: "success",
      position: "top",
    }),
  warn: (message: string) =>
    baseToast({
      title: message,
      status: "warning",
      position: "top",
    }),
  error: (error: string | Error | unknown) => {
    let message = "";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    baseToast({
      title: message,
      status: "error",
      position: "top",
    });
  },
};

export { ToastContainer, toast };
