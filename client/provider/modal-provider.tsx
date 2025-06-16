"use client";
import { useModal } from "@/store";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface Props {
  children: React.ReactNode;
}

const ModalProvider = ({ children }: Props) => {
  //   Mounting logic for hydration
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [data, isOpen, setClose, setOpen, modal] = useModal(
    useShallow((state) => [
      state.data,
      state.isOpen,
      state.setClose,
      state.setOpen,
      state.modal,
    ])
  );
  return (
    <>
      {children}
      {isOpen && modal}
    </>
  );
};

export default ModalProvider;
