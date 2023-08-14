import React from "react";

interface ErrorMessageProps {
  message?: string;
}

export const InputErrorMessage = ({ message }: ErrorMessageProps) => {
  return <span className="text-danger absolute bottom-[-20px] text-xs">{message}</span>;
};
