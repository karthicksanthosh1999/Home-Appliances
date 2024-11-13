import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TableLoading from '../../Components/Loading/TableLoading'
import { AppDispatch, Rootstate } from '../../Features/Store';
import { useDispatch, useSelector } from 'react-redux'
import { IGift } from '../../types/giftTypes'
import axios from 'axios'
import { BASE_URI } from '../../App'
import { createGiftThunk, deleteGiftThunk, fetchGiftSuccess, updateGiftThunk } from '../../Features/ActionTypes/giftActionTypes'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import SearchInput from '../../Components/Inputs/SearchInput';
import { IUserProps } from '../../Components/Navbar/TopBar';
import DeleteModal from '../../Components/Modals/DeleteModal';
import { motion } from 'framer-motion'
import PlainInput from '../../Components/Inputs/PlainInput';
import CancelButton from '../../Components/Buttons/CancelButton';
import Selects from '../../Components/Inputs/Selects';

const Gifts: FC<IUserProps> = ({ user }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { giftLoading, giftsResponses } = useSelector((state: Rootstate) => state.gift)

    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<IGift>>()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [limit, _setLimit] = useState<number>(10);
    const [selectedGift, setSelectedGift] = useState<string | null>(null)
    const [values, setValues] = useState<IGift>({
        createdPerson: user?.userId,
        giftName: "",
        giftType: "",
        giftValue: "",
        quantity: "",
    });

    const giftOptions = [
        {
            value: "Discount",
            option: "Discount",
        },
        {
            value: "Product",
            option: "Product",
        },
        {
            value: "Service",
            option: "Service",
        }
    ]

    useEffect(() => {
        axios.get(`${BASE_URI}/api/gift/search-gift?search=${searchTerm}&page=${page}&limit=${limit}`,
            {
                withCredentials: true
            }
        ).then((res) => {
            const { pagination, gifts } = res.data.responses;
            dispatch(fetchGiftSuccess(gifts));
            setTotalPages(pagination.totalPages)
        }).catch((err) => {
            console.log(err)
        })

    }, [page, searchTerm, dispatch, limit])

    const openDeleteModal = (id: string) => {
        setSelectedGift(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        handleFormReset()
        setIsDeleteModalOpen(false)
    }

    const openCreateModal = () => setCreateModalOpen(true)
    const closeCreateModal = () => {
        handleFormReset()
        setCreateModalOpen(false)
    }
    const openUpdateModal = async (id: string) => {
        if (id) {
            const res = await axios.get(`${BASE_URI}/api/gift/getSingle-gift/${id}`, { withCredentials: true });
            const { responses } = res.data
            setValues({
                createdPerson: responses?.createdPerson,
                giftName: responses?.giftName,
                giftType: responses?.giftType,
                giftValue: responses?.giftValue,
                quantity: responses?.quantity,
            })
            setSelectedGift(id)
        }
        setUpdateModalOpen(true)
    }
    const closeUpdateModal = () => {
        handleFormReset()
        setUpdateModalOpen(false)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name, value } = event.target
        setValues((preV) => ({
            ...preV, [name]: value
        }))
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (values && handleFormValidation()) {
            dispatch(createGiftThunk(values))
            closeCreateModal()
        }
    }

    const handleDelete = () => {
        if (selectedGift) {
            dispatch(deleteGiftThunk(selectedGift))
            setSelectedGift(null)
            closeDeleteModal()
        }
    }

    const handleFormReset = () => {
        setValues({
            createdPerson: user?.userId,
            giftName: "",
            giftType: "",
            giftValue: "",
            quantity: "",
        })
    }

    const handleFormValidation = (): Boolean => {
        const newerrors: Partial<IGift> = {}
        if (!values.giftName) {
            newerrors.giftName = "Gift Name is required"
        }
        if (!values.giftType) {
            newerrors.giftType = "Gift Type is required"
        }
        if (!values.giftValue) {
            newerrors.giftValue = "Gift Type is required"
        }
        if (!values.quantity) {
            newerrors.quantity = "Quontity is required"
        }
        setErrors(newerrors);
        return Object.keys(newerrors).length === 0;
    }

    const handleFocuse: FocusEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name } = event.target;
        setErrors((preV) => ({
            ...preV, [name]: ""
        }))
    }

    const handleUpdate: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (selectedGift && handleFormValidation()) {
            dispatch(updateGiftThunk(selectedGift, values))
            closeUpdateModal()
            handleFormReset()
        }
        setSelectedGift(null)
    }

    return (
        <section>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Gifts</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Gift Name' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                            <tr>
                                {/* <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            onChange={(event) => handleSelectAll(event.target.checked)}
                                            checked={isAllSelected}
                                            indeterminate={selectedUserIds.length > 0 && !isAllSelected}
                                            id="checkbox-all"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-r-gray-900 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 dark:text-gray-100" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th> */}
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Gift Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Gift Type
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Gift Value
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Gift Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                giftLoading ? (
                                    <tr>
                                        <td colSpan={6} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    giftsResponses?.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={8} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        giftsResponses && giftsResponses.map((item, i) => (
                                            <tr key={i} className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                {/* <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={selectedUserIds.includes(item._id!)}
                                                            onChange={() => handleCheckboxChange(item._id!)}
                                                            id="checkbox-table-1"
                                                            type="checkbox"
                                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td> */}

                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item?.giftName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item?.giftType}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item?.giftValue}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item?.quantity}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id)} /></a>
                                                    <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faTrash} onClick={() => openDeleteModal(item._id)} /></a>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-between items-center p-5'>
                    <OutlineButton
                        disabled={page === 1}
                        onclick={() => setPage(page - 1)}
                        title='Previous'
                        type='button' />
                    <div>
                        <h3 className='text-gray-900 dark:text-gray-400'>Page {page} of {totalPages}</h3>
                    </div>
                    <OutlineButton
                        disabled={page === totalPages}
                        onclick={() => setPage(page + 1)}
                        title='Next'
                        type='button' />
                </div>
            </div >
            {/* DELETE MODAL */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title='Delete Gift'
                message='Are you sure you want to delete this Gift ?'
                onConfirm={handleDelete}
            />
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
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Create Gift
                                    </h3>
                                    <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <div className='space-y-3'>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Name :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='giftName' name='giftName' value={values.giftName} onChange={handleChange} type='text' placeholder='Gift Name' />
                                                {errors?.giftName && <p className='text-red-600 text-sm mt-2'>{errors.giftName}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Type :</h6>
                                            <div className='col-span-3'>
                                                <Selects onFocus={handleFocuse} id='giftType' name='giftType' value={values.giftType} onChange={handleChange} options={giftOptions} />
                                                {errors?.giftType && <p className='text-red-600 text-sm mt-2'>{errors.giftType}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Value :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='giftValue' name='giftValue' value={values.giftValue} onChange={handleChange} type='text' placeholder='Gift Value' />
                                                {errors?.giftValue && <p className='text-red-600 text-sm mt-2'>{errors.giftValue}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Quantity :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='quantity' name='quantity' value={values.quantity} onChange={handleChange} type='text' placeholder='Quantity' />
                                                {errors?.quantity && <p className='text-red-600 text-sm mt-2'>{errors.quantity}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                    <OutlineButton type='reset' title='Disacard' onclick={closeCreateModal} />
                                    <OutlineButton type='submit' title='Add Gift' />
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* UPDATE MODAL */}
            {isUpdateModalOpen && (
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
                        <form onSubmit={handleUpdate} noValidate>
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Update Gift
                                    </h3>
                                    <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <div className='space-y-3'>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Name :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='giftName' name='giftName' value={values.giftName} onChange={handleChange} type='text' placeholder='Gift Name' />
                                                {errors?.giftName && <p className='text-red-600 text-sm mt-2'>{errors.giftName}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Type :</h6>
                                            <div className='col-span-3'>
                                                <Selects id='giftType' name='giftType' value={values.giftType} onFocus={handleFocuse} onChange={handleChange} options={giftOptions} />
                                                {errors?.giftType && <p className='text-red-600 text-sm mt-2'>{errors.giftType}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Gift Value :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='giftValue' name='giftValue' value={values.giftValue} onChange={handleChange} type='text' placeholder='Gift Value' />
                                                {errors?.giftValue && <p className='text-red-600 text-sm mt-2'>{errors.giftValue}</p>}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                            <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Quantity :</h6>
                                            <div className='col-span-3'>
                                                <PlainInput onForcus={handleFocuse} id='quantity' name='quantity' value={values.quantity} onChange={handleChange} type='text' placeholder='Quantity' />
                                                {errors?.giftValue && <p className='text-red-600 text-sm mt-2'>{errors.giftValue}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                    <OutlineButton type='reset' title='Disacard' onclick={closeUpdateModal} />
                                    <OutlineButton type='submit' title='Update Gift' />
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </section >
    )
}

export default Gifts
