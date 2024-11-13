import React, { ChangeEvent, FocusEvent } from "react";

interface IDateProps {
  value?: string,
  id: string,
  name: string,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<IDateProps> = ({ id, name, onChange, onFocus, value }) => {
  return (
    <>
      <div className="relative w-36 ">
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className="w-full text-sm p-2 border-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-gray-100 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
          type="date" />
        <div className="absolute top-0 right-0 flex items-center h-full pr-3 pointer-events-none">
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12H20V17H15V12ZM22 3H21V1H19V3H11V1H9V3H8C6.9 3 6 3.9 6 5V19C6 20.1 6.9 21 8 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM22 5V7H8V5H22ZM8 19V9H22V19H8Z" fill="black" />
          </svg>
        </div>
      </div>


    </>
  )
}

export default DateInput;