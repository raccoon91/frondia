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
        secondary: baseTheme.colors.orange[200],
        background: baseTheme.colors.yellow[50],
        surface: "#fcfcf5",
        sub: baseTheme.colors.gray[400],
        border: baseTheme.colors.gray[200],
        theader: baseTheme.colors.orange[100],
        tactive: baseTheme.colors.green[50],
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
    components: {
      Input: {
        variants: {
          outline: {
            field: {
              _focusVisible: {
                borderColor: baseTheme.colors.yellow[500],
                boxShadow: `0 0 0 2px ${baseTheme.colors.yellow[500]}`,
              },
            },
          },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
