import { extendTheme, withDefaultColorScheme, theme as baseTheme } from "@chakra-ui/react";

export const theme = extendTheme(
  {
    fonts: {
      heading: "'Noto Sans KR Variable', sans-serif",
      body: "'Noto Sans KR Variable', sans-serif",
    },
    colors: {
      brand: baseTheme.colors.yellow,
    },
    semanticTokens: {
      colors: {
        primary: baseTheme.colors.yellow[500],
        background: baseTheme.colors.yellow[50],
        surface: "#fcfcf5",
        border: baseTheme.colors.gray[200],
      },
    },
    styles: {
      global: {
        "*": {
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: baseTheme.colors.yellow[500],
            borderRadius: "3px",
          },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
