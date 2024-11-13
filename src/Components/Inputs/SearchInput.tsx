import { ChangeEvent, FC } from 'react'

interface ISearchInputProps {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    type: 'text' | 'file' | 'tel' | 'numbers' | "email";
    placeholder: string;
    value?: string

}

const SearchInput: FC<ISearchInputProps> = ({ onChange, type, placeholder, value }) => {
    return (
        <div className='max-w-2xl'>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-[#FF7700]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type={type} value={value} onChange={onChange} id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-[#FF7700] rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-gray-100 focus:ring-[#FF7700] focus:outline-[#FF7700] focus:border-[#FF7700]" placeholder={placeholder} required />
            </div>
        </div>
    )
}

export default SearchInput
