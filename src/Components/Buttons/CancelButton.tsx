import { FC } from 'react';

interface ICancelButtton {
    onClick: () => void,
    type: "submit" | "button" | "reset",
    title: string
}


const CancelButton: FC<ICancelButtton> = ({ onClick, title, type }) => {
    return (
        <div>
            <button
                type={type}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:dark:bg-gray-900 hover:dark:text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200 hover:rotate-90"
                onClick={onClick}
            >
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                </svg>
                <span className="sr-only">{title}</span>
            </button>
        </div>
    )
}

export default CancelButton
