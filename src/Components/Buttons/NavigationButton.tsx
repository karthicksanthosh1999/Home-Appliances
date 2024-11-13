import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Link } from 'react-router-dom';

interface INavigationeButton {
    title: string
    icon?: any;
    to?: string
}

const NavigationButton: FC<INavigationeButton> = ({ title, icon, to }) => {

    return (
        <div>
            <Link to={`${to}`} className="relative flex items-center justify-center p-1 overflow-hidden text-sm font-medium rounded-lg group border border-[#FF7A00] text-[#FF7A00] hover:bg-[#ff7a00] hover:text-[#fff] focus:ring-4 focus:outline-none focus:ring-blue-300">
                <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 flex gap-2 items-center">
                    {
                        icon ? (
                            <FontAwesomeIcon icon={icon} />
                        ) : (
                            ""
                        )
                    }
                    {title}
                </span>
            </Link>
        </div>
    )
}

export default NavigationButton
