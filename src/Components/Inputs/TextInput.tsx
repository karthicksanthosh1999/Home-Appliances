import { FC, ChangeEventHandler, FocusEventHandler } from 'react';

interface ITextInputProps {
    label: string;
    placeholder?: string;
    name: string;
    type: "text" | "number" | "email" | "password";
    id: string;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    value?: string | number;
}

const TextInput: FC<ITextInputProps> = ({ label, placeholder, name, type, id, onChange, value, onFocus }) => {
    return (
        <div className="relative mt-2 w-full">
            <input
                type={type}
                id={id}
                className="border-1 peer block w-full appearance-none rounded-lg border border-[#979797] bg-transparent px-2.5 pb-2.5 pt-2 text-sm text-gray-900 focus:ring-[#004AD7] focus:shadow-lg outline-[#004AD7] dark:text-gray-400"
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                autoComplete="off"
            />
            <label
                htmlFor={id}
                className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none dark:text-gray-400 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >
                {label}
            </label>
        </div>
    );
};

export default TextInput;
