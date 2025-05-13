export const log = {
  info: (message: string) => {
    console.log(message);
  },
  warn: (message: string) => {
    console.warn(message);
  },
  error: (error: string | Error | unknown) => {
    if (error instanceof Error) {
      console.error(error.name);
      console.error(error.stack);
      console.error(error.message);
    } else {
      console.error(error);
    }
  },
};
