import React from 'react';

type Props = React.ComponentProps<'input'> & {
  value: string | number;
  setValue: (value: string) => void;
};

export const NumericInput: React.FC<Props> = ({ className, value = '', setValue, onChange, ...props }) => {
  const [inputValue, setInputValue] = React.useState(value.toString());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      setInputValue(newValue);
      setValue(newValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const newValue = inputValue.slice(0, -1);
      if (/^\d*$/.test(newValue)) {
        setInputValue(newValue);
        setValue(newValue);
      }
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    />
  );
};
