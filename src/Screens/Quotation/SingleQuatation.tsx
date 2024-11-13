import { FC, useEffect, useState } from 'react'
import logo from '../../../public/logo.svg'
import Hr from '../../Components/Lines/Hr'
import { formatDateToYYYYMMDD } from '../../utilities/help'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URI } from '../../App'
import ButtonIcon from '../../Components/Buttons/ButtonIcon'
import { faEnvelope, faPrint } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { renderAnimation } from '../../utilities/LoadingHelper'
import { IQuotation } from '../../types/quotationTypes'

const SingleQuotation: FC = () => {

    const { id } = useParams();
    const [qountity, setQountity] = useState<IQuotation | null>(null)
    const [isLoading, setIsLoading] = useState<"loading" | "success" | "failure" | null>(null)
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`${BASE_URI}/api/quotation/single-quotation/${id}`).then(res => {
            setQountity(res.data.responses)
        }).catch(err => console.log(err))
    }, [])

    const openLoadingModal = () => {
        setIsLoading("loading")
        setIsLoadingModalOpen(true)
    }
    const closeLoadingModal = () => {
        setIsLoadingModalOpen(false)
        setIsLoading(null)
    }


    // Export PDF Functoin
    const handleExportPdfQuotation = async (id: string) => {
        openLoadingModal()
        await axios.get(`${BASE_URI}/api/quotation/export-single-quotation/${id}`, {
            method: "GET",
            responseType: "blob"
        }).then((response) => {
            setIsLoading("success")
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute("download", 'quotation.pdf');
            document.body.appendChild(link)
            link.click();
            setTimeout(() => {
                closeLoadingModal()
            }, 3000);
        })
            .catch(err => {
                setIsLoading("failure")
                setTimeout(() => {
                    closeLoadingModal()
                }, 3000)
                console.log(err)
            })
    }

    // Send Email Function
    const handleQuotationSendEmailFunction = async (id: string) => {
        openLoadingModal()
        await axios.get(`${BASE_URI}/api/quotation/email-single-quotation/${id}`).then((res) => {
            setIsLoading("success")
            toast.success(res.data.message)
            setTimeout(() => {
                closeLoadingModal()
            }, 3000);
        }).catch(err => {
            console.log(err)
            setIsLoading("failure")
            toast.error(err.message)
            setTimeout(() => {
                closeLoadingModal()
            }, 3000);
        })
    }

    return (
        <>
            <section className="max-w-full min-h-screen bg-[#f3f3f3] dark:bg-gray-900 m-5 dark:text-gray-100">
                {/* HEADER */}
                <div className="flex justify-between p-5">
                    <div className="flex gap-5">
                        <img src={logo} alt="companyImg" className='h-12 w-auto' />
                        <div>
                            <h1>Wizinoa</h1>
                            <div className='flex gap-4'>
                                <h1>Phone No:</h1>
                                <h1>8220942394</h1>
                            </div>
                            <div className='flex gap-4'>
                                <h1>Email :</h1>
                                <h1>karhtick.wizinoa@gmail.com</h1>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-4'>
                            <h1>Invoice Date:</h1>
                            <h1>2024-09-30</h1>
                        </div>
                        <div className='flex gap-4'>
                            <h1>Invoice No:</h1>
                            <h1>WIZ001</h1>
                        </div>
                    </div>
                </div>

                <div className='p-5'>
                    <h1>Bill To:</h1>
                    <Hr />
                    <div className="flex justify-between items-start">
                        <div>
                            <h1>{qountity && qountity.customerDetails.customerName}</h1>
                            <h1>{qountity && qountity.customerDetails.mobile}</h1>
                            <h1>{qountity && qountity.customerDetails.email}</h1>
                            <h1>{qountity && qountity.customerDetails.address}</h1>
                        </div>
                        <div>
                            <h1 className='font-semibold text-xl mb-5'>Share</h1>
                            <div className="flex gap-5">
                                <ButtonIcon type='button' icon={faPrint} id='print' toolTipTitle='Print' toolTipPlace='bottom' onClick={() => handleExportPdfQuotation(id!)} />
                                <ButtonIcon type='button' icon={faEnvelope} id='email' toolTipTitle='Email' toolTipPlace='bottom' onClick={() => handleQuotationSendEmailFunction(id!)} />
                                <ButtonIcon type='button' icon={faWhatsapp} id='Whatsapp' toolTipTitle='Whatsapp' toolTipPlace='bottom' />
                            </div>
                        </div>
                    </div>
                    {/* BILL TABLE */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white dark:bg-gray-900">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        S.No
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Invoice No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Customer ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 hitespace-nowrap">
                                        Branch
                                    </th>
                                    <th scope="col" className="px-6 py-3 hitespace-nowrap">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Mobile Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Email ID
                                    </th>
                                    {/* <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Products Purchased
                                            </th> */}
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Total Price
                                    </th>
                                    {/* <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Paid
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Pending 
                                         </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    qountity?.products && qountity?.products.map((_item, i) => (
                                        <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4">
                                                {i + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {qountity.quotationNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDateToYYYYMMDD(qountity?.createdDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {qountity?.customerDetails?.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/* {item.branch} */}
                                                Madurai
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {qountity.customerDetails.customerName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {qountity.customerDetails.mobile}
                                            </td>
                                            <td className="px-6 py-4">
                                                {qountity.customerDetails.email}
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                        {formatDateToYYYYMMDD(item.quotationDate)}
                                                    </td> */}
                                            <td className="px-6 py-4 ">
                                                {qountity.prices.total}
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                        {qountity.prices.paid}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {qountity.prices.pending}
                                                    </td> */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Price Details */}
                    <div className="bg-[#f3f3f3] dark:bg-gray-900 m-5 dark:text-gray-100">
                        <div className='p-5 mt-5'>
                            <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Additional Charges :</h6>
                                    <div className='col-span-1'>
                                        <h1>{qountity?.prices.additionalCharges}</h1>
                                    </div>
                                </div>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Add Discount :</h6>
                                    <div className='col-span-1'>
                                        <h1>{qountity?.prices.addDiscount}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Total Price :</h6>
                                    <div className='col-span-1'>
                                        <h1 className='text-xl text'>Rs :{qountity?.prices.total ? qountity?.prices.total : " 0"}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section >

            {/* LOADING MODAL */}
            {isLoadingModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0 }}
                    id="default-modal"
                    aria-hidden="true"
                    className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow flex items-center justify-center" >
                            {isLoading && renderAnimation(isLoading)}
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    )
}

export default SingleQuotation
