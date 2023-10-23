import { KeyboardEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Flex, Input, Modal, ModalContent } from "@chakra-ui/react";
import { EditorParams } from "./types";
import { grid } from "../../styles";

export const SelectEditor = forwardRef((params: EditorParams, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [option, setOption] = useState<{ label: string; value: string | number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);

  useEffect(() => {
    const focused = params.api.getFocusedCell();
    focused?.column.getInstanceId();

    if (focused?.column.getInstanceId() === params?.column.getInstanceId()) {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!params?.options?.length) return;

    const option = params.options.find(option => params.optionIsEqual(option, params.value));

    if (!option) return;

    setOption(option);
  }, [params?.options]);

  // useEffect(() => {
  //   itemRef.current?.children[itemIndex]?.scrollIntoView({ block: "center" });
  // }, [itemIndex]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return option;
      },

      focusIn() {
        inputRef.current?.focus();
        setIsOpen(true);

        return false;
      },

      focusOut() {
        inputRef.current?.blur();
        setIsOpen(false);

        return false;
      },
    };
  });

  const handleOpenMenu = () => {
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleSelectEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "Enter") {
      handleOpenMenu();
    }
  };

  const handleMoveItem = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      setItemIndex(p => {
        if (p + 1 > params.options.length - 1) {
          itemRef.current?.children[0]?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
          return 0;
        } else {
          itemRef.current?.children[p + 1]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return p + 1;
        }
      });
    } else if (e.key === "ArrowUp") {
      setItemIndex(p => {
        if (p - 1 < 0) {
          itemRef.current?.children[params.options.length - 1]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return params.options.length - 1;
        } else {
          itemRef.current?.children[p - 1]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return p - 1;
        }
      });
    }
  };

  const handleClickItem = (option: any) => () => {
    setOption(option);

    setTimeout(() => {
      params.api.stopEditing();
      params.api.setFocusedCell(params.node.rowIndex ?? 0, params.column);
    }, 200);
  };

  return (
    <>
      <Input
        ref={inputRef}
        readOnly
        value={params.optionFormatter(option)}
        onClick={handleOpenMenu}
        onKeyDown={handleSelectEnter}
        sx={{
          rounded: "none",
          border: "none",
          backgroundColor: grid.backgroundColor,
          _focusVisible: {
            border: "none",
          },
        }}
      />
      <Modal isOpen={isOpen} onClose={handleCloseMenu}>
        <ModalContent
          position="fixed"
          overflow="auto"
          top={(inputRef.current?.getBoundingClientRect().top ?? 0) - 24}
          left={inputRef.current?.getBoundingClientRect().left}
          w={params.column.getActualWidth()}
          h="200px"
          rounded="none"
        >
          <Box ref={itemRef} tabIndex={0} outline="none" onKeyDown={handleMoveItem}>
            {params.options?.map((option, index) => (
              <Flex
                key={index}
                align="center"
                px="16px"
                h="40px"
                _hover={{
                  backgroundColor: "primary",
                  color: "white",
                  cursor: "pointer",
                }}
                backgroundColor={index === itemIndex ? "primary" : "none"}
                color={index === itemIndex ? "white" : "none"}
                onClick={handleClickItem(option)}
              >
                {params.optionFormatter(option)}
              </Flex>
            ))}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
});
