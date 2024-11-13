import { ChangeEvent, FC, FocusEvent } from 'react'

interface IPlainInputProps {
    lable?: string,
    placeholder?: string,
    readOnly?: boolean,
    disabled?: boolean,
    name: string,
    accept?: string,
    type: "text" | "number" | "email" | "date" | "file" | "password",
    id: string,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    value?: string | number,
    onForcus?: (event: FocusEvent<HTMLInputElement>) => void
}
const PlainInput: FC<IPlainInputProps> = ({ id, name, type, onChange, placeholder, value, onForcus, accept, readOnly, disabled }) => {
    return (
        <>
            <input disabled={disabled} readOnly={readOnly} type={type} id={id} accept={accept} className={`bg-gray-50 dark:bg-gray-600 border border-gray-300 text-gray-900 dark:text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${disabled ? "cursor-not-allowed" : ""}`} placeholder={placeholder} onFocus={onForcus} required onChange={onChange} name={name} value={value} />
        </>
    )
}
export default PlainInput
