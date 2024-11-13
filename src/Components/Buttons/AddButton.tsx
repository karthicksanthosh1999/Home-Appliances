import { FC } from 'react'

interface IAddButton {
    onClick?: () => void,
    type: "submit" | "button" | "reset",
    title: string
}

const AddButton: FC<IAddButton> = ({ onClick, type, title }) => {
    return (
        <div>
            <button type={type} className='text-white bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 border font-medium rounded-lg text-sm px-5 py-2 text-center' onClick={onClick}>{title}</button>
        </div>
    )
}

export default AddButton
