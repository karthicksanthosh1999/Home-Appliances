import { FC } from 'react'

interface IExportButtton {
    onClick?: () => void,
    type: "submit" | "button" | "reset",
    title: string
}
const ExportButton: FC<IExportButtton> = ({ title, type, onClick  }) => {


    return (
        <>
            <button type={type} className="w-full inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" onClick={onClick}>
                { title }
                <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16.5V17C9.691 14.422 11.6 13.047 14 13V16C14 16.551 14.511 17 15.143 17C15.507 17 15.818 16.842 16.026 16.609C17.959 14.58 22 10.5 22 10.5C22 10.5 17.959 6.418 16.025 4.363C15.7898 4.13128 15.4732 4.00097 15.143 4C14.511 4 14 4.447 14 5V8C9.34 8 8 12.871 8 16.5ZM5 21H19C19.2652 21 19.5196 20.8946 19.7071 20.7071C19.8946 20.5196 20 20.2652 20 20V13.954C19.336 14.63 18.636 15.347 18 16.001V19H6V7H13V5H5C4.73478 5 4.48043 5.10536 4.29289 5.29289C4.10536 5.48043 4 5.73478 4 6V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21Z" fill="black" />
                    </svg>

                </span>
            </button>

        </>
    )
}

export default ExportButton
