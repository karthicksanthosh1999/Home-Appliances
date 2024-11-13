import { FC } from 'react'
import { formatDateToYYYYMMDD } from '../../utilities/help'
import { quotationHistoryProps } from '../../types/quotationTypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const QuotationHistory: FC<quotationHistoryProps> = ({ quotationHistoryProps }) => {
    return (
        <div>
            <body className="bg-gray-50 dark:bg-gray-900">
                <div className="w-10/12 md:w-10/12 lg:6/12 mx-auto relative py-10">
                    <div className="border-l-2 mt-5">
                        {
                            quotationHistoryProps && quotationHistoryProps.map((item, i) => (
                                <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-blue-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0" key={i}>
                                    <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0 flex justify-center items-center">
                                        <FontAwesomeIcon icon={faCheck} className='w-2 h-full font-bold text-4xl' />
                                    </div>
                                    <div className="w-10 h-1 bg-blue-300 absolute -left-10 z-0"></div>
                                    <div className="flex-auto">
                                        <h1 className="text-xl font-bold">{item?.historyCommand}</h1>
                                        <h3>{formatDateToYYYYMMDD(item?.historyDate)}</h3>
                                    </div>
                                    <a href="#" className="text-center text-white hover:text-gray-300">{item?.historyStatus}</a>
                                </div>
                            ))
                        }

                        {/* <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-pink-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">

                            <div className="w-5 h-5 bg-pink-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                            <div className="w-10 h-1 bg-pink-300 absolute -left-10 z-0"></div>
                            <div className="flex-auto">
                                <h1 className="text-lg">Day 1</h1>
                                <h1 className="text-xl font-bold">Orientation and Briefing on Uniliver basics</h1>
                                <h3>Classroom</h3>
                            </div>
                            <a href="#" className="text-center text-white hover:text-gray-300">Download materials</a>
                        </div>

                        <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-green-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">

                            <div className="w-5 h-5 bg-green-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                            <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

                            <div className="flex-auto">
                                <h1 className="text-lg">Day 1</h1>
                                <h1 className="text-xl font-bold">Orientation and Briefing on Uniliver basics</h1>
                                <h3>Classroom</h3>
                            </div>
                            <a href="#" className="text-center text-white hover:text-gray-300">Download materials</a>
                        </div>

                        <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-purple-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">

                            <div className="w-5 h-5 bg-purple-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>
                            <div className="w-10 h-1 bg-purple-300 absolute -left-10 z-0"></div>

                            <div className="flex-auto">
                                <h1 className="text-lg">Day 1</h1>
                                <h1 className="text-xl font-bold">Orientation and Briefing on Uniliver basics</h1>
                                <h3>Classroom</h3>
                            </div>
                            <a href="#" className="text-center text-white hover:text-gray-300">Download materials</a>
                        </div>

                        <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-yellow-600 text-white rounded mb-10 flex-col md:flex-row">

                            <div className="w-5 h-5 bg-yellow-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 -mt-2 md:mt-0"></div>


                            <div className="w-10 h-1 bg-yellow-300 absolute -left-10 z-0"></div>


                            <div className="flex-auto">
                                <h1 className="text-lg">Day 1</h1>
                                <h1 className="text-xl font-bold">Orientation and Briefing on Uniliver basics</h1>
                                <h3>Classroom</h3>
                            </div>
                            <a href="#" className="text-center text-white hover:text-gray-300">Download materials</a>
                        </div> */}
                    </div>
                </div>
            </body >
        </div >
    )
}

export default QuotationHistory
