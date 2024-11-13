import { ChangeEvent, FC } from 'react'
import { Options } from './Selects';

interface ISelectButtonProps {
    value?: string,
    options: Options[],
    id: string,
    name: string,
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectButton: FC<ISelectButtonProps> = ({ id, name, options, onChange, value }) => {

    return (
        <>
            <div className="w-full">
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className='bg-orange-400 dark:text-white py-1 px-2 rounded-lg active:scale-90 active:shadow-xl'
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
        </>
    )
}

export default SelectButton
