import { extendTheme, withDefaultColorScheme, theme as baseTheme } from "@chakra-ui/react";

export const theme = extendTheme(
  {
    fonts: {
      heading: `'Noto Sans KR Variable', sans-serif`,
      body: `'Noto Sans KR Variable', sans-serif`,
    },
    colors: {
      brand: baseTheme.colors.yellow,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
