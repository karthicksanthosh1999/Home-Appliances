import { FC, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHistory, faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import PlainInput from '../../Components/Inputs/PlainInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { changeQuotaionToInvoiceThunk, changeQuotationStatusThunk, deleteQuotationThunk, fetchQuotationSuccess } from '../../Features/ActionTypes/quotationActionTypes';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import SearchInput from '../../Components/Inputs/SearchInput';
import TableLoading from '../../Components/Loading/TableLoading';
import QuotationHistory from '../../Components/History/QuotationHistory';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import { IQuotation } from '../../types/quotationTypes';
import { BASE_URI } from '../../App';
import SelectButton from '../../Components/Inputs/SelectButton';
import ButtonIcon from '../../Components/Buttons/ButtonIcon';

const Quotation: FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const { quotationLoading, quotation } = useSelector((state: Rootstate) => state.quotation)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null>(null)
    const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [checkedQuotationIds, setCheckedQuotationIds] = useState<string[]>([])

    const openDeleteModal = (id: string) => {
        setSelectedQuotationId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setSelectedQuotationId(null)
    }
    const openHistoryModal = () => {
        setIsHistoryModalOpen(true)
    }
    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false)
        setSelectedQuotationId(null)
    }
    const closeCreateModal = () => setIsCreateModalOpen(false)
    useEffect(() => {
        axios.get(`${BASE_URI}/api/quotation/search-quotations/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, quotations } = res.data.responses;
            dispatch(fetchQuotationSuccess(quotations));
            setTotalPages(pagination.totalPages)
        })
        dispatch(fetchAllBranchThunk())
    }, [dispatch, searchTerm, page, limit])

    const handleDelete = () => {
        if (selectedQuotationId) {
            dispatch(deleteQuotationThunk(selectedQuotationId))
            closeDeleteModal()
            setSelectedQuotationId(null)
        }
    }

    const handleHistory = async (id: string) => {
        openHistoryModal()
        console.log(id)
        if (id) {
            console.log(selectedQuotation)
            await axios.get<{ responses: IQuotation }>(`${BASE_URI}/api/quotation/single-quotation/${id}`).then((res) => {
                setSelectedQuotation(res.data.responses)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const handleSignleCheckBox = (invoId: string) => {
        setCheckedQuotationIds((preV) =>
            preV.includes(invoId) ?
                preV.filter((id) => id !== invoId) :
                [...preV, invoId]
        )
    }

    const handleMultipleCheckedBox = (isChecked: boolean) => {
        if (isChecked) {
            const allQuotationsIds = quotation.map(item => item._id).filter((id): id is string => id !== undefined)
            setCheckedQuotationIds(allQuotationsIds)
        } else {
            setCheckedQuotationIds([])
        }
    }

    const convertOptions = [
        {
            option: "Approved",
            value: "Approved"
        },
        {
            option: "Rejected",
            value: "Rejected"
        },
        {
            option: "Sent",
            value: "Sent"
        },
        {
            option: "Draft",
            value: "Draft"
        }
    ]

    const handleConvertDropdown = async (id: string, value: string) => {
        dispatch(changeQuotationStatusThunk(id, value))
    }

    const isQuotionConvert = (id: string) => {
        const isConvert: boolean = quotation.filter(item => item._id === id ? item : []).some((item) => item?.quotationStatus === "Approved" ? true : false)
        return isConvert
    }
    const isAllSelected = quotation.length > 0 && checkedQuotationIds.length === quotation.length;

    const changeQuotaionToInvoice = (id: string) => {
        dispatch(changeQuotaionToInvoiceThunk(id))
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900'>Quotations</h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <OutlineButton title='Filter' type='button' icon={faFilter} /> */}
                        <SearchInput placeholder='Search Quotation No' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <OutlineButton title='Add New' type='button' onclick={() => navigate('add-Quotation')} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            checked={isAllSelected}
                                            onChange={(event) => handleMultipleCheckedBox(event.target.checked)}
                                            id="checkbox-all"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Quotation No
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Generated Date
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
                                <th scope="col" className="px-6 py-3">
                                    Email ID
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    GST ( in % )
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Updated Date
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Quotation Status
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Convert
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                quotationLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    quotation && quotation.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        quotation && quotation.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600" key={i}>
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={checkedQuotationIds.includes(item._id)}
                                                            onChange={() => handleSignleCheckBox(item._id)}
                                                            id="checkbox-table-1"
                                                            type="checkbox"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.quotationNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.createdDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerDetails?.customerName ? item.customerDetails.customerName : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* {item.branch} */}
                                                    Madurai
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerDetails.customerName ? item.customerDetails.customerName : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customerDetails.mobile}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customerDetails.email}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.prices.gst ? item.prices.gst : "-"}%
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.prices.total ? item.prices.total : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDateToYYYYMMDD(item.updatedDate)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <SelectButton id='convert' name='quotationStatus' options={convertOptions} value={item.quotationStatus} onChange={(e) => handleConvertDropdown(item._id!, e.target.value)} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        isQuotionConvert(item._id) ? (
                                                            <ButtonIcon icon={faRepeat} disable={false} id='convert' toolTipPlace='top' toolTipTitle='Convert' type='button' onClick={() => changeQuotaionToInvoice(item._id!)} />
                                                        ) : (
                                                            <ButtonIcon icon={faRepeat} disable={true} id='convert' toolTipPlace='top' toolTipTitle='Convert' type='button' />
                                                        )
                                                    }
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-orange-500 hover:text-orange-500">
                                                        <FontAwesomeIcon fontSize={15} icon={faEye} onClick={() => navigate(`/quotation/single-quotation/${item._id}`)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-orange-500 hover:text-orange-500">
                                                        <FontAwesomeIcon fontSize={15} icon={faHistory} onClick={() => handleHistory(item._id)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-orange-500 hover:text-orange-500">
                                                        <FontAwesomeIcon fontSize={15} icon={faTrash} onClick={() => openDeleteModal(item._id!)} /></a>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-between items-center p-5 dark:text-gray-400'>
                    <OutlineButton
                        title='Previous'
                        type='button'
                        disabled={page === 1}
                        onclick={() => setPage(page - 1)}
                    />
                    <div>
                        <h3>Page {page} of {totalPages}</h3>
                    </div>
                    <OutlineButton
                        title='Next'
                        type='button'
                        disabled={page === 1}
                        onclick={() => setPage(page - 1)} />
                </div>

                {/* DELETE MODAL */}
                {isDeleteModalOpen && (
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Delete Quotation
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl text-gray-900 dark:text-gray-400'>Are you sure, You want to delete the Quotation?</h1>
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeDeleteModal} />
                                    <OutlineButton type='button' title='Delete' onclick={handleDelete} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CREATE MODAL */}
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                        id="default-modal"
                        aria-hidden="true"
                        className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
                    >
                        <div className="relative p-4 w-full max-w-xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Create Customer
                                    </h3>
                                    <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <div className='space-y-3'>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Customer Name :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='productName' name='productName' type='text' placeholder='Customer Name' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Mobile :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='mobileName' name='mobileName' type='text' placeholder='Mobile' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Email Address :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='emailAddress' name='emailAddress' type='email' placeholder='Email Address' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Address :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='address' name='address' type='text' placeholder='Address' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Customer ID :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='customerId' name='customerId' type='text' placeholder='Customer ID' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-base font-semibold'>Known Via :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput id='knownVia' name='knownVia' type='text' placeholder='Known Via' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-start'>
                                            <h6 className='col-span-2 text-base font-semibold'>Feedback:</h6>
                                            <div className='col-span-3'>
                                                <textarea id="message" rows={5} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Feedback"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                    <OutlineButton type='reset' title='Disacard' onclick={closeCreateModal} />
                                    <OutlineButton type='button' title='Add Customer' />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* History MODAL */}
                {isHistoryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                        id="default-modal"
                        aria-hidden="true"
                        className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
                    >
                        <div className="relative p-4 w-full max-w-6xl max-h-full">
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Quotation History
                                    </h3>
                                    <CancelButton onClick={closeHistoryModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-1'>
                                    <QuotationHistory quotationHistoryProps={selectedQuotation?.quotationHistory} />
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeHistoryModal} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}

export default Quotation
