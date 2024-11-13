import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, MouseEventHandler } from 'react'
import { Tooltip } from 'react-tooltip'

type ButtonIconsProps = {
    icon: any,
    onClick?: MouseEventHandler<HTMLInputElement | HTMLButtonElement>
    type: "submit" | "button" | "reset",
    id: string,
    toolTipTitle: string,
    toolTipPlace: "top" | "right" | "left" | "bottom",
    disable?: boolean
}

const ButtonIcon: FC<ButtonIconsProps> = ({ icon, type, onClick, id, toolTipTitle, toolTipPlace, disable }) => {
    console.log(disable)
    return (
        <div>
            <button
                id={id}
                data-tooltip-id={id}
                data-tooltip-content={toolTipTitle}
                data-tooltip-place={toolTipPlace}
                type={type}
                onClick={onClick}
                disabled={disable}
                className={`text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-orange-500 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-orange-500 dark:text-orange-500 dark:hover:text-white dark:focus:ring-orange-800 dark:hover:bg-orange-500 ${disable ? "cursor-not-allowed bg-gray-600" : "cursor-pointer"}`}>
                <FontAwesomeIcon icon={icon} />
            </button>
            {
                toolTipTitle && <Tooltip id={id} />
            }
        </div>
    )
}

export default ButtonIcon
