import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

interface IOutlineButton {
    title: string
    type: "submit" | "button" | "reset"
    onclick?: () => void;
    icon?: any;
    disabled?: boolean
}

const OutlineButton: FC<IOutlineButton> = ({ onclick, title, type, icon, disabled }) => {


    return (
        <>
            <button disabled={disabled} onClick={onclick} type={type} className={`relative flex items-center justify-center p-1 overflow-hidden text-sm font-medium rounded-lg group border border-[#FF7A00] text-[#FF7A00] hover:bg-[#ff7a00] hover:text-[#fff] focus:ring-4 focus:outline-none focus:ring-blue-300 cursor-pointer ${disabled ? "bg-[#cbcbcb] focus:outline-none focus:ring-0 hover:cursor-not-allowed hover:bg-[#cbcbcb] dark:hover:bg-gray-400 text-[#fff]" : ""}`}>
                <span className={`relative px-5 py-1 transition-all ease-in duration-75  rounded-md group-hover:bg-opacity-0 flex gap-2 items-center ${disabled ? "bg-[#cbcbcb] " : "bg-white "}`}>
                    {
                        icon ? (
                            <FontAwesomeIcon icon={icon} />
                        ) : (
                            ""
                        )
                    }
                    {title}
                </span>
            </button>
        </>
    )
}

export default OutlineButton
