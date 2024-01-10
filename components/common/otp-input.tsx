/* eslint-disable react/display-name */
import React from "react";
import ReactOtpInput from "react-otp-input";

interface OtpInputProps {
    value: string;
    numInputs: number;
    onChange: (otp: string) => void;
}

export const OtpInput = React.forwardRef<any, any>(({ numInputs, onChange, value, ...props }, ref) => {
    return (
        <ReactOtpInput
            numInputs={numInputs}
            ref={ref}
            onChange={onChange}
            value={value}
            containerStyle="gap-4 flex"
            inputStyle={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #D0DDD5",
            }}
            focusStyle={{
                border: "1px solid #19A966",
                outline: "none",
            }}
            renderInput={(inputProps, index) => {
                return (
                    <input
                        {...inputProps}
                        className="text-center text-base outline-none"
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "10px",
                            border: "1px solid #E0E0E0",
                            background: "#F5F5F5",
                        }}
                    />
                );
            }}
            {...props}
        />
    );
});
