import { FC } from 'react';

interface IResetButton {
    type : "reset" | "submit" | "button"
    title : string
    onClick? : ()=>void
}

const ResetButton:FC<IResetButton> = ({onClick,title,type}) => {
  return (
    <>
         <button type={type} onClick={onClick} className="text-[#EC5C28] font-semibold focus:outline-none focus:ring focus:ring-red-300 rounded-3xl text-sm px-5 py-2 text-center">{title}</button>
    </>
  )
}

export default ResetButton
