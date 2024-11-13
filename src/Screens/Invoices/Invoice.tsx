import { FC, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import PlainInput from '../../Components/Inputs/PlainInput';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { deleteInvoiceThunk, fetchInvoiceSuccess, multipleDeleteInvoiceThunk } from '../../Features/ActionTypes/invoiceActionTypes';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import SearchInput from '../../Components/Inputs/SearchInput';
import TableLoading from '../../Components/Loading/TableLoading';
import { IUserProps } from '../../Components/Navbar/TopBar';
import { BASE_URI } from '../../App';

const Invoice: FC<IUserProps> = ({ user }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const { invoiceLoading, invoiceResponses } = useSelector((state: Rootstate) => state.Invoice)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [checkedInvoiceIds, setCheckedInvoiceIds] = useState<string[]>([])

    const openDeleteModal = (id: string) => {
        setSelectedInvoiceId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setSelectedInvoiceId(null)
    }
    // const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => setIsCreateModalOpen(false)
    useEffect(() => {
        axios.get(`${BASE_URI}/api/invoice/search-invoices/?search=${searchTerm}&page=${page}&limit=${limit}`, { withCredentials: true })
            .then((res) => {
                const { pagination, invoices } = res.data.responses;
                dispatch(fetchInvoiceSuccess(invoices));
                setTotalPages(pagination.totalPages)
            })
        dispatch(fetchAllBranchThunk())

    }, [dispatch, searchTerm, page, limit])

    const handleDelete = () => {
        if (selectedInvoiceId) {
            dispatch(deleteInvoiceThunk(selectedInvoiceId))
            closeDeleteModal()
            setSelectedInvoiceId(null)
        }
    }

    const handleSignleCheckBox = (invoId: string) => {
        setCheckedInvoiceIds((preV) =>
            preV.includes(invoId) ?
                preV.filter((id) => id !== invoId) :
                [...preV, invoId]
        )
    }

    const handleMultipleCheckedBox = (isChecked: boolean) => {
        if (isChecked) {
            const allInvoicesIds = invoiceResponses.map(item => item._id).filter((id): id is string => id !== undefined)
            setCheckedInvoiceIds(allInvoicesIds)
        } else {
            setCheckedInvoiceIds([])
        }
    }

    const isAllSelected = invoiceResponses.length > 0 && checkedInvoiceIds.length === invoiceResponses.length

    const handleMultipleDelete = () => {
        dispatch(multipleDeleteInvoiceThunk(checkedInvoiceIds))
    };
    return (
        <>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900'>Invoices</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Invoice No' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {
                            checkedInvoiceIds && checkedInvoiceIds.length === 0 ? (
                                <div></div>
                            ) : (
                                <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} />
                            )
                        }
                        <OutlineButton title='Add New' type='button' onclick={() => navigate('add-invoice')} />
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Products Purchased
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    GST (%)
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Paid
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Pending
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                invoiceLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    invoiceResponses && invoiceResponses.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        invoiceResponses && invoiceResponses.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={checkedInvoiceIds.includes(item._id)}
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
                                                    {item.invoiceNo ? item.invoiceNo : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.products[0].purchasedDate) ? formatDateToYYYYMMDD(item.products[0].purchasedDate) : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerDetails?.customerId ? item.customerDetails?.customerId : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branchId?.branchName ? item.branchId?.branchName : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerDetails?.customerName ? item.customerDetails?.customerName : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customerDetails?.mobile ? item.customerDetails?.mobile : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customerDetails?.email ? item.customerDetails?.email : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDateToYYYYMMDD(item.products[0].purchasedDate) ? formatDateToYYYYMMDD(item.products[0].purchasedDate) : '-'}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.prices.gst ? item.prices.gst : "-"}%
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.prices.total ? item.prices.total : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.prices.paid ? item.prices.paid : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.prices.pending ? item.prices.pending : '-'}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <Link to={`/invoice/single-invoice/${user?.userId}/${item?._id}`} className="font-medium text-black hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faEye} /></Link>
                                                    {/* <a href="#" className="font-medium text-black hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} /></a> */}
                                                    <a href="#" className="font-medium text-black hover:text-[#C60000]">
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
                                        Delete Invoice
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl text-gray-900 dark:text-gray-400'>Are you sure, You want to delete the invoice?</h1>
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

            </div >
        </>
    )
}

export default Invoice
