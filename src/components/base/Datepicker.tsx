import { FC } from "react";
import dayjs from "dayjs";
import ReactDatePicker from "react-datepicker";
import { Box, ComponentWithAs, Input, InputProps } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";

interface IDatepickerProps extends Omit<ComponentWithAs<"input", InputProps>, "value" | "onChange"> {
  value?: string | null;
  onChange: (date: Date | null) => void;
}

export const Datepicker: FC<IDatepickerProps> = ({ value, onChange, ...props }) => {
  return (
    <Box
      w="full"
      sx={{
        ".react-datepicker": {
          borderColor: "border",
        },
        ".react-datepicker-wrapper, .react-datepicker__input-container": {
          width: "100%",
        },
        ".react-datepicker__navigation-icon::before": {
          borderColor: "primary",
        },
        ".react-datepicker__header": {
          paddingTop: 0,
          background: "orange.100",
          borderColor: "border",
        },
        ".react-datepicker__current-month": {
          height: "32px",
          lineHeight: "32px",
          fontSize: "14px",
        },
        ".react-datepicker__day:hover": {
          background: "orange.500",
          color: "white",
        },
        ".react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range":
          {
            background: "primary",
          },
      }}
    >
      <ReactDatePicker
        showPopperArrow={false}
        selected={value ? dayjs(value).toDate() : null}
        onChange={onChange}
        customInput={<Input {...props} />}
        dateFormat="yyyy-MM-dd"
      />
    </Box>
  );
};
