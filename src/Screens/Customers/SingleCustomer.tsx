import axios from 'axios';
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatDateToYYYYMMDD } from '../../utilities/help';
import { BASE_URI } from '../../App';
import { ICustomer } from '../../types/customerTypes';

const SingleCustomer: FC = () => {
    const { id } = useParams();

    const [customer, setCustomer] = useState<ICustomer>()
    useEffect(() => {
        axios.get<{ responses: ICustomer }>(`${BASE_URI}/api/customer/single-customer/${id}`).then(res => {
            setCustomer(res.data.responses)
        }).then(err => console.log(err))
    }, [])
    return (
        <div>
            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border mt-5">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Customer Profile
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        This is some information about the user.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.customerName}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.email}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Phone number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.mobile}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.address}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Branch
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.branch?.branchName}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Visited Date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {formatDateToYYYYMMDD(customer?.date)}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Feedback
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                                {customer?.feedBack}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default SingleCustomer
