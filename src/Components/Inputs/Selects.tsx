import { ChangeEvent, FC, FocusEvent } from 'react'

export type Options = {
    value: string | undefined,
    option: string
}

interface ISelectProps {
    label?: string,
    value?: string,
    options: Options[],
    id: string,
    name: string,
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
    disable?: boolean
}

const Selects: FC<ISelectProps> = ({ id, name, options, label, value, onChange, onFocus, disable }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 ">
                    {label}
                </label>
            )}
            <select
                disabled={disable}
                onFocus={onFocus}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-sm p-2 border-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-gray-100 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
            >
                <option value="" disabled className='text-gray-900 dark:text-gray-200'>Select option</option>
                <hr />
                {options && options.length > 0 ? (
                    options.map((option, index) => (
                        <option value={option.value} selected key={index} className='text-gray-900 dark:text-white'>
                            {option.option}
                        </option>
                    ))
                )
                    :
                    (
                        <option value={''} disabled>Data not found</option>
                    )
                }
            </select>
        </div>
    );
};


export default Selects
