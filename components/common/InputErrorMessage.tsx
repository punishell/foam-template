import React from "react";

interface ErrorMessageProps {
    message?: string;
}

export const InputErrorMessage = ({ message }: ErrorMessageProps) => {
    return <span className="absolute bottom-[-20px] text-xs text-danger">{message}</span>;
};
