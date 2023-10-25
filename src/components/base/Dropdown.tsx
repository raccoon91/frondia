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
import { Box, Flex, Input, LayoutProps, Modal, ModalContent } from "@chakra-ui/react";

interface IDropdownProps {
  w?: LayoutProps["w"];
  h?: LayoutProps["h"];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Dropdown: FC<PropsWithChildren<IDropdownProps>> = ({ value, w, h = "200px", onChange, children }) => {
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

  const handleSelectEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "Enter") {
      setIsOpen(true);
    }
  };

  const handleKeyboard = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const target = wrapperRef.current?.children?.[itemIndex];

      if (!(target instanceof HTMLDivElement)) {
        return;
      }

      if (!inputRef.current) return;

      const event = new Event("change", { bubbles: true });

      inputRef.current.value = target.dataset["value"] ?? value;
      inputRef.current.dispatchEvent(event);

      console.log("enter", inputRef.current);

      // setIsOpen(false);

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

  const handleClickItem = (e: SyntheticEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) {
      return;
    }

    if (!inputRef.current) return;

    const event = new Event("change", { bubbles: true });

    inputRef.current.value = e.target.dataset["value"] ?? value;
    inputRef.current.dispatchEvent(event);

    console.log("click", inputRef.current);

    // setIsOpen(false);
  };

  return (
    <>
      <Input
        ref={inputRef}
        w={w}
        rounded="none"
        cursor="cell"
        readOnly
        value={value}
        onClick={handleOpenMenu}
        onKeyDown={handleSelectEnter}
        // onChange={onChange}
      />
      <Modal isOpen={isOpen} onClose={handleCloseMenu}>
        <ModalContent
          position="fixed"
          overflow="auto"
          top={rect.top - 24}
          left={rect.left}
          minW={rect.width}
          minH="40px"
          maxH={h}
          rounded="none"
        >
          <Box ref={wrapperRef} tabIndex={0} outline="none" onKeyDown={handleKeyboard} onClick={handleClickItem}>
            {Children.map(children, (child, index) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  ...(child?.props ?? {}),
                  selected: child.props.value === value,
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
