import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import PlainInput from '../../Components/Inputs/PlainInput';
import SearchInput from '../../Components/Inputs/SearchInput';
import axios from 'axios';
import TableLoading from '../../Components/Loading/TableLoading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { createBranchThunk, deleteBranchThunk, fetchBranchSuccess, updateBranchThunk, multipleDeleteBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import toast from 'react-hot-toast';
import { IBranch } from '../../Features/Reducers/branchReducer';
import { BASE_URI } from '../../App';

export interface paginationInterface {
    search: string,
    page: number,
    limit: number
}

export interface IBranchDetails {
    customerData: number,
    productData: number,
    employeeData: number
}

const Branch: FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { loading, branches } = useSelector((state: Rootstate) => state.branch)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isBranchDetailsModalOpen, setIsBranchDetailsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [openTab, setOpenTab] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
    const [selectedBranchDetails, setSelectedBranchDetails] = useState<IBranchDetails | null>(null)
    const [limit, _setLimit] = useState<number>(10)
    const [branchErrors, setBranchErrors] = useState<Partial<IBranch>>({})
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
    const [values, setValues] = useState<IBranch>({
        branchName: "",
        city: "",
        country: "",
        street: "",
        managerId: "",
        state: ""
    })

    const openDeleteModal = (id: string) => {
        setSelectedBranch(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        branchReset();
        setIsDeleteModalOpen(false)
    }
    const openUpdateModal = (id: string) => {
        setSelectedBranch(id);
        fetchSelectedBranch(id);
        setIsUpdateModalOpen(true)
    }
    const closeUpdateModal = () => {
        branchReset();
        setIsUpdateModalOpen(false)
    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        branchReset();
        setIsCreateModalOpen(false)
    }
    const openBranchDetailsModal = async (id: string) => {
        await axios.get(`${BASE_URI}/api/branch/total-branche-details/${id}`, { withCredentials: true })
            .then((res) => setSelectedBranchDetails(res.data.responses))
            .catch(err => console.log(err))
        setIsBranchDetailsModalOpen(true)
    }
    const closeBranchDetailsModal = () => {
        setIsBranchDetailsModalOpen(false)
    }

    // Handler for selecting/deselecting a single user checkbox
    const handleCheckboxChange = (userId: string) => {
        setSelectedUserIds((preVselected) =>
            preVselected.includes(userId)
                ? preVselected.filter(id => id !== userId) // Remove userid if already existed
                : [...preVselected, userId] // Add userId if not selected
        )
    }

    // Handler for toggling select all checkboxes
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allBranchIds = branches.map(item => item._id).filter((id): id is string => id !== undefined);
            setSelectedUserIds(allBranchIds)
        } else {
            setSelectedUserIds([])
        }
    }

    // Determine if all checkboxes are selected
    const isAllSelected = branches.length > 0 && selectedUserIds.length === branches.length;

    // Delete multiple datas
    const handleMultipleDelete = () => {
        dispatch(multipleDeleteBranchThunk(selectedUserIds))
    }

    const branchReset = () => {
        setValues({
            branchName: "",
            city: "",
            country: "",
            street: "",
            managerId: "",
            state: ""
        })
    }

    const handleDelete = () => {
        if (selectedBranch) {
            dispatch(deleteBranchThunk(selectedBranch))
            toast.success("Branch deleted successfully")
            setSelectedBranch(null)
            closeDeleteModal()
        }
    }

    const handleValidation = (): Boolean => {
        const newError: Partial<IBranch> = {};
        if (!values.branchName) {
            newError.branchName = "Branch name is required!"
        }
        if (!values.managerId) {
            newError.managerId = "Branch manager is required!"
        }
        if (!values.street) {
            newError.street = "Street is required!"
        }
        if (!values.city) {
            newError.city = "City is required!"
        }
        if (!values.state) {
            newError.state = "State is required!"
        }
        if (!values.country) {
            newError.country = "Country is required!"
        }

        setBranchErrors(newError);

        return Object.keys(newError).length === 0;
    }

    useEffect(() => {
        axios.get(`${BASE_URI}/api/branch/search-branches/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, branches } = res.data.responses;
            console.log(branches)
            dispatch(fetchBranchSuccess(branches));
            setTotalPages(pagination.totalPages)
        }).catch((err) => {
            console.log(err)
        })

    }, [page, searchTerm, dispatch, limit])

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;
        setValues((preV) => (
            { ...preV, [name]: value }
        ))
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            dispatch(createBranchThunk(values))
            closeCreateModal();
            branchReset();
        } else {
            console.log("Error in form validataion function")
        }
    }

    const fetchSelectedBranch = async (id: string) => {
        await axios.get(`${BASE_URI}/api/branch/single-branch/${id}`, { withCredentials: true }).then((res) => {
            setValues(res.data.responses)
        }).catch((err) => console.log(err))
    }

    const handleUpdate: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            if (selectedBranch) {
                dispatch(updateBranchThunk(selectedBranch, values))
                branchReset();
                closeUpdateModal()
                setSelectedBranch(null)
            }
        } else {
            console.log("Error in form validataion function")
        }
    }

    const handleFocuse: FocusEventHandler<HTMLInputElement> = (event) => {
        const { name } = event.target;
        setBranchErrors((preV) => ({
            ...preV, [name]: ""
        }))
    }
    return (
        <>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Branches</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Branch Name' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {
                            selectedUserIds && selectedUserIds.length === 0 ? (
                                <div></div>
                            ) : (
                                <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} />
                            )
                        }
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            onChange={(event) => handleSelectAll(event.target.checked)}
                                            checked={isAllSelected}
                                            // indeterminate={selectedUserIds.length > 0 && !isAllSelected}
                                            id="checkbox-all"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-r-gray-900 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 dark:text-gray-100" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Branch Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Branch Id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Manager
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Street
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    City
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    State
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Country
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    branches?.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        branches && branches.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={selectedUserIds.includes(item._id!)}
                                                            onChange={() => handleCheckboxChange(item._id!)}
                                                            id="checkbox-table-1"
                                                            type="checkbox"
                                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branchName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branchId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.managerId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.street}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.city}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.state}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.country}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faEye} onClick={() => openBranchDetailsModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
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
                                        Delete Branch
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl text-gray-900 dark:text-gray-400'>Are you sure, You want to delete the branch?</h1>
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
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Create Branch
                                        </h3>
                                        <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3 dark:text-gray-400 text-gray-900'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Branch Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='branchName' name='branchName' value={values.branchName} onChange={handleChange} type='text' placeholder='Branch Name' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Manager :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='manager' name='managerId' value={values.managerId} onChange={handleChange} type='text' placeholder='Manager' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Street :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='street' name='street' value={values.street} onChange={handleChange} type='text' placeholder='Street' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>City :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='city' name='city' value={values.city} onChange={handleChange} type='text' placeholder='City' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>State:</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='state' name='state' value={values.state} onChange={handleChange} type='text' placeholder='State' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Country :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='country' name='country' value={values.country} onChange={handleChange} type='text' placeholder='Country' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Disacard' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add Branch' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Update MODAL */}
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
                                <div className="relative bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow" >
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold">
                                            Update Branch
                                        </h3>
                                        <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Branch Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='branchName' name='branchName' value={values.branchName}
                                                        onChange={handleChange} onForcus={handleFocuse} type='text' placeholder='Branch Name' />
                                                    {branchErrors.branchName && <span className='text-xs text-red-500 inline-block'>{branchErrors.branchName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Manager :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='manager' name='managerId' value={values.managerId} onChange={handleChange} type='text' placeholder='Manager' onForcus={handleFocuse} />
                                                    {branchErrors.managerId && <span className='text-xs text-red-500 inline-block'>{branchErrors.managerId}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Street :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='street' name='street' value={values.street} onChange={handleChange} type='text' placeholder='Street' />
                                                    {branchErrors.street && <span className='text-xs text-red-500 inline-block'>{branchErrors.street}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>City :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='city' name='city' value={values.city} onChange={handleChange} type='text' placeholder='City' />
                                                    {branchErrors.city && <span className='text-xs text-red-500 inline-block'>{branchErrors.city}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>State:</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='state' name='state' value={values.state} onChange={handleChange} type='text' placeholder='State' />
                                                    {branchErrors.state && <span className='text-xs text-red-500 inline-block'>{branchErrors.state}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-sm font-semibold'>Country :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id='country' name='country' value={values.country} onChange={handleChange} type='text' placeholder='Country' />
                                                    {branchErrors.country && <span className='text-xs text-red-500 inline-block'>{branchErrors.country}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeUpdateModal} />
                                        <OutlineButton type='submit' title='Update Branch' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* BRANCH DETAILS MODAL */}
                {isBranchDetailsModalOpen && (
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow dark:text-gray-100 text-gray-900" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold">
                                        Branch Details
                                    </h3>
                                    <CancelButton onClick={closeBranchDetailsModal} title={'close button'} type={'button'} />
                                </div>
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap">
                                        <div className="w-full">
                                            <ul
                                                className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                                                role="tablist"
                                            >
                                                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                                    <a
                                                        className={
                                                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                            (openTab === 1 ? "text-gray-50 bg-gray-600"
                                                                : "text-gray-100")
                                                        }
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setOpenTab(1);
                                                        }}
                                                        data-toggle="tab"
                                                        href="#link1"
                                                        role="tablist"
                                                    >
                                                        Total Customers
                                                    </a>
                                                </li>
                                                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                                    <a
                                                        className={
                                                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                            (openTab === 2
                                                                ? "text-gray-50 bg-gray-600"
                                                                : "text-gray-100")
                                                        }
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setOpenTab(2);
                                                        }}
                                                        data-toggle="tab"
                                                        href="#link2"
                                                        role="tablist"
                                                    >
                                                        Total Employees
                                                    </a>
                                                </li>
                                                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                                    <a
                                                        className={
                                                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                            (openTab === 3
                                                                ? "text-gray-50 bg-gray-600"
                                                                : "text-gray-100")
                                                        }
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setOpenTab(3);
                                                        }}
                                                        data-toggle="tab"
                                                        href="#link3"
                                                        role="tablist"
                                                    >
                                                        Total Products
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-900 w-full mb-6 shadow-lg rounded">
                                                <div className="px-4 py-5 flex-auto">
                                                    <div className="tab-content tab-space">
                                                        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                                            <p>
                                                                {selectedBranchDetails?.customerData}
                                                            </p>
                                                        </div>
                                                        <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                                            <p>
                                                                {selectedBranchDetails?.employeeData}
                                                            </p>
                                                        </div>
                                                        <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                                            <p>
                                                                {selectedBranchDetails?.productData}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeBranchDetailsModal} />
                                    <OutlineButton type='button' title='Delete' onclick={handleDelete} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}


export default Branch
