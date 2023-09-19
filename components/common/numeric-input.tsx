import React from 'react';

type Props = React.ComponentProps<'input'> & {};

export const NumericInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, onChange: setValue, value, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = React.useState(value?.toString() || '');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (/^\d*$/.test(newValue)) {
        setInputValue(newValue);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        const newValue = inputValue.slice(0, -1);
        if (/^\d*$/.test(newValue)) {
          setInputValue(newValue);
        }
      }
    };

    return (
      <input
        type="text"
        ref={forwardedRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    );
  },
);

NumericInput.displayName = 'NumericInput';
