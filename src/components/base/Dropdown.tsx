import {
  ChangeEvent,
  Children,
  FC,
  KeyboardEvent,
  PropsWithChildren,
  SyntheticEvent,
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Flex, Input, InputProps, LayoutProps, Modal, ModalContent } from "@chakra-ui/react";

interface IDropdownProps extends Omit<InputProps, "display"> {
  display?: string;
  menuHeight?: LayoutProps["h"];
}

export const Dropdown: FC<PropsWithChildren<IDropdownProps>> = ({
  display,
  menuHeight = "160px",
  value,
  onChange,
  children,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);

  const childLength = useMemo(() => Children.count(children), [children]);
  const rect = useMemo(
    () => (inputRef.current ? inputRef.current.getBoundingClientRect() : { top: 0, left: 0, width: 0 }),
    [inputRef.current]
  );

  const handleOpenMenu = () => {
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleEnterInput = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "Enter") {
      setIsOpen(true);
    }
  };

  const handleNavigationOption = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const target = wrapperRef.current?.children?.[itemIndex];

      if (!(target instanceof HTMLDivElement)) {
        return;
      }

      if (!inputRef.current) return;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(inputRef.current, target.dataset["value"] ?? value);

      const event = new Event("input", { bubbles: true });

      inputRef.current.dispatchEvent(event);

      setIsOpen(false);

      return;
    }

    let index = itemIndex;

    if (e.key === "ArrowDown") {
      index += 1;
    } else if (e.key === "ArrowUp") {
      index -= 1;
    }

    if (index < 0) index = childLength - 1;
    if (index > childLength - 1) index = 0;

    wrapperRef.current?.children?.[index]?.scrollIntoView({ behavior: "smooth" });

    setItemIndex(index);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    onChange?.(e);
  };

  const handleClickOption = (e: SyntheticEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) {
      return;
    }

    if (!inputRef.current) return;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(inputRef.current, e.target.dataset["value"] ?? value);

    const event = new Event("input", { bubbles: true });

    inputRef.current.dispatchEvent(event);

    setIsOpen(false);
  };

  return (
    <>
      <Input
        ref={inputRef}
        value={display ?? value ?? ""}
        onClick={handleOpenMenu}
        onKeyUp={handleEnterInput}
        onChange={handleChangeInput}
        {...props}
      />
      <Modal isOpen={isOpen} onClose={handleCloseMenu}>
        <ModalContent
          position="fixed"
          overflow="auto"
          top={rect.top - 20}
          left={rect.left}
          w={rect.width}
          minH="40px"
          maxH={menuHeight}
          rounded="none"
        >
          <Box
            ref={wrapperRef}
            tabIndex={0}
            outline="none"
            onKeyDown={handleNavigationOption}
            onClick={handleClickOption}
          >
            {Children.map(children, (child, index) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  ...(child?.props ?? {}),
                  selected: child.props?.value?.toString() === value?.toString(),
                  focused: index === itemIndex,
                  onHover: () => {
                    setItemIndex(index);
                  },
                });
              }

              return null;
            })}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

interface IDropdownItemProps {
  value: string;
  selected?: boolean;
  focused?: boolean;
  onHover?: () => void;
}

export const DropdownItem: FC<PropsWithChildren<IDropdownItemProps>> = ({
  value,
  selected,
  focused,
  children,
  onHover,
}) => {
  return (
    <Flex
      align="center"
      h="40px"
      px="16px"
      backgroundColor={focused ? "secondary" : selected ? "primary" : "none"}
      color={focused || selected ? "white" : "none"}
      outline="none"
      _hover={{
        backgroundColor: "secondary",
        color: "white",
        cursor: "pointer",
      }}
      data-value={value}
      onMouseOver={onHover}
    >
      {children}
    </Flex>
  );
};
