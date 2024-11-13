import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import Selects from '../../Components/Inputs/Selects';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import { createCustomerThunk, deleteCustomerThunk, fetchCustomerSuccess, multipleDeleteCustomerThunk, updateCustomerThunk } from '../../Features/ActionTypes/customerActionTypes';
import TableLoading from '../../Components/Loading/TableLoading';
import axios from 'axios';
import SearchInput from '../../Components/Inputs/SearchInput';
import PlainInput from '../../Components/Inputs/PlainInput';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URI } from '../../App';
import { ICustomer } from '../../types/customerTypes';

export interface ICustomerInput {
    customerName: string,
    branch: string,
    mobile: string,
    email: string,
    address: string,
    knownVia: string,
    feedBack: string,
}
export const leadReourcesOptions = [
    {
        option: "Google",
        value: 'google'
    },
    {
        option: "LinkedIn",
        value: 'linkedIn'
    },
    {
        option: "Blog",
        value: 'blog'
    },
    {
        option: "Whatsapp",
        value: 'whatsApp'
    },
    {
        option: "Facebook",
        value: 'facebook'
    },
]

const Customers: FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const { branches } = useSelector((state: Rootstate) => state.branch)
    const { customerLoading, customersResponse } = useSelector((state: Rootstate) => state.cutomer)

    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // const [isExistingUser, setIsExistingUser] = useState<boolean>(false)
    const [page, setPage] = useState(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [errors, setErrors] = useState<Partial<ICustomerInput>>({})
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)


    const [checkedCutomerIds, setcheckedCustomerIds] = useState<string[]>([])

    const openDeleteModal = (id: string) => {
        setSelectedCustomerId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }
    // const openExistingModal = (id: string) => {
    //     setIsExistingUser(true)
    //     setSelectedCustomerId(id)
    // }
    // const closeExistingModal = () => {
    //     setIsExistingUser(false)
    //     setSelectedCustomerId(null)
    // }
    const openUpdateModal = (id: string) => {
        fetchSelectedCustomer(id)
        setSelectedCustomerId(id)
        setIsUpdateModalOpen(true)
    }
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false)
        formReset()
    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
        formReset();
    }

    const [values, setValues] = useState<ICustomerInput>({
        address: "",
        branch: "",
        customerName: "",
        email: "",
        feedBack: "",
        knownVia: "",
        mobile: "",
    })
    useEffect(() => {
        axios.get(`${BASE_URI}/api/customer/search-customers/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, customers } = res.data.responses;
            dispatch(fetchCustomerSuccess(customers));
            setTotalPages(pagination.totalPages)
        })
        dispatch(fetchAllBranchThunk())

    }, [dispatch, searchTerm, page, limit])

    const formReset = () => {
        setValues({
            address: "",
            branch: "",
            customerName: "",
            email: "",
            feedBack: "",
            knownVia: "",
            mobile: "",
        })
    }

    const handleCheckboxChange = (customerId: string) => {
        setcheckedCustomerIds((preV) =>
            preV.includes(customerId)
                ? preV.filter(id => id !== customerId)
                : [...preV, customerId]
        )
    }

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allCustomersIds = customersResponse.map(item => item._id).filter((id): id is string => id !== undefined);
            setcheckedCustomerIds(allCustomersIds)
        } else {
            setcheckedCustomerIds([])
        }
    }

    const isAllSelected = customersResponse && customersResponse?.length > 0 && checkedCutomerIds?.length === customersResponse.length;
    const handleDelete = () => {
        if (selectedCustomerId) {
            dispatch(deleteCustomerThunk(selectedCustomerId))
            closeDeleteModal();
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = async (event) => {
        const { value, name } = event.target;
        if (name === "mobile") {
            if (value.length === 10) {
                await axios.get<{ responses: ICustomer }>(`${BASE_URI}/api/customer/existing-customer/${value}`, {
                    withCredentials: true
                }).then(res => {
                    const { customerName, email, _id } = res.data.responses;
                    console.log(res.data.responses)
                    // openExistingModal(_id!)
                    setSelectedCustomerId(_id!)
                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                } max-w-md w-full bg-white dark:bg-gray-900 dark:border dark:border-gray-400 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                            {customerName}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-200">
                                <button
                                    onClick={() => {
                                        navigate(`/customers/single-customers/${_id}`)
                                    }}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    See
                                </button>
                            </div>
                        </div>
                    ))
                }).catch(err => [
                    console.log(err)
                ])
            } else {
                // closeExistingModal()
            }
        }
        setValues((preV) => ({
            ...preV, [name]: value
        }))
    }

    const handleFocuse: FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (event) => {
        const { name } = event.target;
        setErrors((preV) => ({
            ...preV, [name]: ""
        }))
    }

    const handleValidation = () => {
        const newErrors: Partial<ICustomerInput> = {};

        if (!values.customerName) {
            newErrors.customerName = "Customer name is required!"
        }
        const mobileRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!values.mobile) {
            newErrors.mobile = "Mobile name is required!"
        } else if (!mobileRegex.test(values.mobile)) {
            newErrors.mobile = "Mobile number must be 10 digits"
        }
        if (!values.email) {
            newErrors.email = "Email name is required!"
        } else if (!emailRegex.test(values.email)) {
            newErrors.email = "Email is not valid"
        }
        if (!values.address) {
            newErrors.address = "Address name is required!"
        }
        if (!values.knownVia) {
            newErrors.knownVia = "Knwon via name is required!"
        }
        if (!values.branch) {
            if (newErrors.branch) {
                newErrors.branch = "Branch name is required!";
            }
        }
        if (!values.feedBack) {
            newErrors.feedBack = "Enquire is required!"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            dispatch(createCustomerThunk(values))
            formReset();
            closeCreateModal()
        }
    }

    const fetchSelectedCustomer = async (id: string) => {
        await axios.get(`${BASE_URI}/api/customer/single-customer/${id}`, {
            withCredentials: true
        }).then((res) => {
            const reponse = res.data.responses
            setValues((preve) => ({
                ...preve,
                address: reponse?.address,
                branch: reponse?.branch?._id,
                customerName: reponse?.customerName,
                email: reponse?.email,
                feedBack: reponse?.feedBack,
                knownVia: reponse?.knownVia,
                mobile: reponse?.mobile,
            }))

        }).catch((err) => console.log(err))
    }

    const handleUpdate: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            if (selectedCustomerId) {
                dispatch(updateCustomerThunk(selectedCustomerId, values))
                formReset();
                closeUpdateModal()
                setSelectedCustomerId(null)
            }
        } else {
            console.log("Error in form validataion function")
        }
    }

    const handleMultipleDelete = () => {
        if (checkedCutomerIds) {
            dispatch(multipleDeleteCustomerThunk(checkedCutomerIds))
            setcheckedCustomerIds([])
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Customers</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Customer, Id' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {
                            checkedCutomerIds.length === 0 ? (
                                <div></div>

                            ) : (
                                <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} />
                            )
                        }
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            onChange={(event) => handleSelectAll(event.target.checked)}
                                            checked={isAllSelected}
                                            id="checkbox-al"
                                            type="checkbox"
                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                        <label htmlFor="checkbox-al" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap" >
                                    Branch Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Mobile Number
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Email ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Customer ID
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Lead Resource
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Enquire
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Customer Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                customerLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    customersResponse?.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold text-gray-900 dark:text-gray-400'>Data not found</td>
                                        </tr>
                                    ) : (
                                        customersResponse && customersResponse.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={checkedCutomerIds.includes(item._id!)}
                                                            onChange={() => handleCheckboxChange(item._id!)}
                                                            id="checkbox-ta"
                                                            type="checkbox"
                                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                                        <label htmlFor="checkbox-ta" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.date!)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerName ? item?.customerName : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branch?.branchName ? item.branch.branchName : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.mobile}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.address}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.customerId}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.knownVia}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.feedBack}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customerStatus}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-[#c60000]  hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-[#c60000] hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faTrash} onClick={() => openDeleteModal(item?._id!)} /></a>
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
                        title='Previous'
                        type='button'
                        disabled={page === 1}
                        onclick={() => setPage(page - 1)}
                    />
                    <div>
                        <h3 className='text-gray-900 dark:text-gray-40'>Page {page} of {totalPages}</h3>
                    </div>
                    <OutlineButton
                        title='Next'
                        type='button'
                        disabled={page === 1}
                        onclick={() => setPage(page + 1)}
                    />
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
                            <div className="relative bg-white dark:bg-gray-900 dark:text-gray-400 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Delete Customer
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl'>Are you sure, You want to delete the customer?</h1>
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeDeleteModal} />
                                    <OutlineButton type='button' title='Delete' onclick={handleDelete} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {/* EXISTING MODAL */}
                {/* {isExistingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                        id="default-modal"
                        aria-hidden="true"
                        className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-60 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
                    >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Delete Customer
                                    </h3>
                                    <CancelButton onClick={closeExistingModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl'>Are you sure, You want to delete the customer?</h1>
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeExistingModal} />
                                    <OutlineButton type='button' title='See' onclick={handleExistingUser} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )} */}

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
                            <div className="relative bg-white dark:bg-gray-900 dark:text-gray-400 rounded-lg shadow" >
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Create Customer
                                        </h3>
                                        <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Customer Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.customerName} name="customerName" onChange={handleChange} onForcus={handleFocuse} id='customerName' type='text' placeholder='Customer Name' />
                                                    {errors.customerName && <span className='text-xs text-red-500 inline-block'>{errors.customerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Mobile :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.mobile} name="mobile" onChange={handleChange} onForcus={handleFocuse} id='mobile' type='text' placeholder='Mobile' />
                                                    {errors.mobile && <span className='text-xs text-red-500 inline-block'>{errors.mobile}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Email Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.email} name="email" onChange={handleChange} onForcus={handleFocuse} id='email' type='email' placeholder='Email Address' />
                                                    {errors.email && <span className='text-xs text-red-500 inline-block'>{errors.customerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.address} name="address" onChange={handleChange} onForcus={handleFocuse} id='address' type='text' placeholder='Address' />
                                                    {errors.address && <span className='text-xs text-red-500 inline-block'>{errors.address}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Lead Resources :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='knownVia' value={values.knownVia} onChange={handleChange} onFocus={handleFocuse} name='knownVia' options={leadReourcesOptions} />
                                                    {errors.knownVia && <span className='text-xs text-red-500 inline-block'>{errors.knownVia}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch} onChange={handleChange} onFocus={handleFocuse} name='branch' options={options} />
                                                    {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-start'>
                                                <h6 className='col-span-2 text-base font-semibold'>Enquire:</h6>
                                                <div className='col-span-3'>
                                                    <textarea id="feedBack" name='feedBack' value={values.feedBack} onChange={handleChange} onFocus={handleFocuse} rows={5} className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-500 rounded-lg border border-gray-300 dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500" placeholder="Feedback"></textarea>
                                                    {errors.feedBack && <span className='text-xs text-red-500 inline-block'>{errors.feedBack}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add Customer' />
                                    </div>
                                </form>
                            </div>
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <form onSubmit={handleUpdate} noValidate>
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Update Customer
                                        </h3>
                                        <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3 text-gray-900 dark:text-gray-400'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Customer Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.customerName} name="customerName" onChange={handleChange} onForcus={handleFocuse} id='customerName' type='text' placeholder='Customer Name' />
                                                    {errors.customerName && <span className='text-xs text-red-500 inline-block'>{errors.customerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Mobile :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.mobile} name="mobile" onChange={handleChange} onForcus={handleFocuse} id='mobile' type='text' placeholder='Mobile' />
                                                    {errors.mobile && <span className='text-xs text-red-500 inline-block'>{errors.mobile}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Email Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.email} name="email" onChange={handleChange} onForcus={handleFocuse} id='email' type='email' placeholder='Email Address' />
                                                    {errors.email && <span className='text-xs text-red-500 inline-block'>{errors.customerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.address} name="address" onChange={handleChange} onForcus={handleFocuse} id='address' type='text' placeholder='Address' />
                                                    {errors.address && <span className='text-xs text-red-500 inline-block'>{errors.address}</span>}
                                                </div>
                                            </div>
                                            {/* <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Customer ID :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.customerId} name="customerId" onChange={handleChange} onForcus={handleFocuse} id='customerId' type='text' placeholder='Customer ID' />
                                                    {errors.customerId && <span className='text-xs text-red-500 inline-block'>{errors.customerId}</span>}
                                                </div>
                                            </div> */}
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Lead Resource :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='knownVia' value={values.knownVia} onChange={handleChange} onFocus={handleFocuse} name='knownVia' options={leadReourcesOptions} />
                                                    {errors.knownVia && <span className='text-xs text-red-500 inline-block'>{errors.knownVia}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch} onChange={handleChange} onFocus={handleFocuse} name='branch' options={options} />
                                                    {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-start'>
                                                <h6 className='col-span-2 text-base font-semibold'>Enquire:</h6>
                                                <div className='col-span-3'>
                                                    <textarea id="feedBack" name='feedBack' value={values.feedBack} onChange={handleChange} onFocus={handleFocuse} rows={5} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-600 dark:text-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Feedback"></textarea>
                                                    {errors.feedBack && <span className='text-xs text-red-500 inline-block'>{errors.feedBack}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Update Customer' />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div >
        </>
    )
}

export default Customers
