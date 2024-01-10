import React from "react";

type Props = React.ComponentProps<"input"> & {};

export const NumericInput = React.forwardRef<HTMLInputElement, Props>(
    ({ className, onChange, ...props }, forwardedRef) => {
        const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
            const numericValue = event.currentTarget.value.replace(/[^0-9]/g, "");
            event.currentTarget.value = numericValue;
            if (onChange) {
                onChange(event);
            }
        };
        return <input type="text" ref={forwardedRef} className={className} onInput={handleInput} {...props} />;
    },
);

NumericInput.displayName = "NumericInput";
