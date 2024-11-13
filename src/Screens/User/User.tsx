import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import PlainInput from '../../Components/Inputs/PlainInput';
import Selects from '../../Components/Inputs/Selects';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import { createUserThunk, deleteUserThunk, fetchUserSuccess, updateUserThunk, } from '../../Features/ActionTypes/userActionsType';
import TableLoading from '../../Components/Loading/TableLoading';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import SearchInput from '../../Components/Inputs/SearchInput';
import axios from 'axios';
import { BASE_URI } from '../../App';

export interface IUserInput {
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    password?: string,
    dob: string,
    doj: string,
    branch: string,
    address: string,
    userType: string,
    salary: string,
    profile: string,
    gender?: string
}

const User: FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { userLoading, users } = useSelector((state: Rootstate) => state.user)
    const { branches } = useSelector((state: Rootstate) => state.branch)
    const genderOption = [
        {
            value: 'Male',
            option: 'Male',
        },
        {
            value: 'Female',
            option: 'Female',
        },
        {
            value: 'Others',
            option: 'Others',
        },
    ]
    const userTypeOptions = [
        {
            value: "Admin",
            option: "Admin",
        },
        {
            value: "Manager",
            option: "Manager",
        },
        {
            value: "Employee",
            option: "Employee",
        },
        {
            value: "Delivery",
            option: "Delivery",
        }
    ]
    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<IUserInput>>({})
    const [page, setPage] = useState<number>(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [values, setValues] = useState<IUserInput>({
        password: "",
        userType: "",
        profile: "",
        firstName: "",
        lastName: "",
        branch: "",
        mobile: "",
        email: "",
        address: "",
        dob: "",
        doj: "",
        salary: "",
    })
    useEffect(() => {
        axios.get(`${BASE_URI}/api/users/search-users/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, users } = res.data.responses;
            dispatch(fetchUserSuccess(users));
            setTotalPage(pagination.totalPages)
        }).catch((err) => console.log(err))
        dispatch(fetchAllBranchThunk())
    }, [dispatch, searchTerm, page, limit])

    const openDeleteModal = (id: string) => {
        setSelectedUserId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setSelectedUserId(null)

    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
        formReset()
    }
    const openUpdateModal = async (id: string) => {
        setSelectedUserId(id)
        setIsUpdateModalOpen(true)
        await axios.get(`${BASE_URI}/api/users/single-user/${id}`, { withCredentials: true }).then((res) => {
            const reponse = res.data.responses
            setValues((preve) => ({
                ...preve,
                address: reponse?.address,
                branch: reponse?.branch?._id,
                firstName: reponse?.firstName,
                lastName: reponse?.lastName,
                password: reponse?.password,
                userType: reponse?.userType,
                email: reponse?.email,
                mobile: reponse?.mobile,
                dob: reponse?.dob,
                doj: reponse?.doj,
                profile: reponse?.profile,
                salary: reponse?.salary,
            }))

        }).catch((err) => console.log(err))
    }
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false)
        formReset()
        setSelectedUserId(null)
    }

    const formReset = () => {
        setValues({
            password: "",
            userType: "",
            profile: "",
            firstName: "",
            lastName: "",
            branch: "",
            mobile: "",
            email: "",
            address: "",
            dob: "",
            doj: "",
            salary: "",
        })
    }

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name, value, files, type } = event.target as HTMLInputElement;
        setValues((preValue) => ({
            ...preValue, [name]: type === "file" ? files?.[0] || null : value
        }))
    }

    const handleFocouse: FocusEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name } = event.target;
        setErrors((preValue) => ({
            ...preValue, [name]: ""
        }))
    }

    const handleValidation = () => {
        const newErrors: Partial<IUserInput> = {};

        if (!values.firstName) {
            newErrors.firstName = "First name is required!"
        }
        if (!values.lastName) {
            newErrors.lastName = "Last name is required!"
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
        if (!values.dob) {
            newErrors.dob = "DOB is required!"
        }
        if (!values.password) {
            newErrors.password = "Password is required!"
        }
        if (!values.doj) {
            newErrors.doj = "DOJ is required!"
        }
        if (!values.salary) {
            newErrors.salary = "Salary is required!"
        }
        if (!values.branch) {
            newErrors.branch = "Branch name is required!";
        }
        if (!values.userType) {
            newErrors.userType = "User type is required!";
        }
        if (!values.gender) {
            newErrors.gender = "Gender is required!";
        }
        if (!values.profile) {
            newErrors.profile = "Profile is required!"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            dispatch(createUserThunk(values))
            closeCreateModal()
            formReset()
        }
    }

    const handleUpdate: FocusEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            if (selectedUserId) {
                dispatch(updateUserThunk(selectedUserId, values))
                closeUpdateModal()
                formReset()
                setSelectedUserId(null)
            }
        }
    }

    const handleDelete = () => {
        if (selectedUserId) {
            dispatch(deleteUserThunk(selectedUserId))
            closeDeleteModal()
            setSelectedUserId(null)
        }
    }

    return (
        <>
            <div className='bg-white dark:bg-gray-900 mt-5'>
                <div className='p-5 flex justify-between gap-2 items-center'>
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Users</h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <OutlineButton title='Filter' type='button' icon={faFilter} /> */}
                        <SearchInput placeholder='Search name' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Branch
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Mobile Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    User Type
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Date Of Birth
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Date Of Join
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Salary
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                userLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    users && users.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={12} className='text-center py-10 text-xl font-semibold text-gray-900 dark:text-gray-400'>Data not found</td>
                                        </tr>
                                    ) : (
                                        users && users.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                                    <img className="w-10 h-10 rounded-full" src={item.profile} alt="Jese image" />
                                                    <div className="ps-3">
                                                        <div className="text-base font-semibold text-gray-900 dark:text-gray-400">{item.firstName}</div>
                                                        <div className="font-normal text-gray-500">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branch?.branchName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.mobile}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.address}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.userType}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.dob!)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.doj!)}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.salary}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:text-gray-300 hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-300 hover:text-[#C60000]">
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
                        title='Previous'
                        type='button'
                        disabled={page === 1}
                        onclick={() => setPage(page - 1)}
                    />
                    <div>
                        <h3 className='text-gray-900 dark:text-gray-400'>Page {page} of {totalPage}</h3>
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
                                        Delete User
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl'>Are you sure, You want to delete the user?</h1>
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
                            <div className="relative bg-white dark:bg-gray-900 dark:text-gray-400 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Create User
                                    </h3>
                                    <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                </div>
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className='p-5'>
                                        <div className='space-y-5'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>First Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.firstName} id='firstName' name='firstName' type='text' placeholder='Name' />
                                                    {errors.firstName && <span className='text-xs text-red-500 inline-block'>{errors.firstName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Last Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.lastName} id='lastName' name='lastName' type='text' placeholder='Name' />
                                                    {errors.lastName && <span className='text-xs text-red-500 inline-block'>{errors.lastName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Email :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.email} id='email' name='email' type='email' placeholder='Email' />
                                                    {errors.email && <span className='text-xs text-red-500 inline-block'>{errors.email}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Mobile No :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.mobile} id='mobile' name='mobile' type='number' placeholder='Mobile No' />
                                                    {errors.mobile && <span className='text-xs text-red-500 inline-block'>{errors.mobile}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Password :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.password} id='password' name='password' type='password' placeholder='Password' />
                                                    {errors.password && <span className='text-xs text-red-500 inline-block'>{errors.password}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Birth :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.dob} id='dob' name='dob' type='date' placeholder='Date Of Birth' />
                                                    {errors.dob && <span className='text-xs text-red-500 inline-block'>{errors.dob}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Join :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.doj} id='doj' name='doj' type='date' placeholder='Date Of Join' />
                                                    {errors.doj && <span className='text-xs text-red-500 inline-block'>{errors.doj}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch} onChange={handleChange} onFocus={handleFocouse} name='branch' options={options} />
                                                    {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.address} id='address' name='address' type='text' placeholder='Address' />
                                                    {errors.address && <span className='text-xs text-red-500 inline-block'>{errors.address}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Gender :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='gender' value={values.gender} onChange={handleChange} onFocus={handleFocouse} name='gender' options={genderOption} />
                                                    {errors.gender && <span className='text-xs text-red-500 inline-block'>{errors.gender}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>User Type :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='userType' value={values.userType} onChange={handleChange} onFocus={handleFocouse} name='userType' options={userTypeOptions} />
                                                    {errors.userType && <span className='text-xs text-red-500 inline-block'>{errors.userType}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Salary Package :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.salary} id='salary' name='salary' type='number' placeholder='Salary' />
                                                    {errors.salary && <span className='text-xs text-red-500 inline-block'>{errors.salary}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Profile :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput accept='image/*' name='profile' onChange={handleChange} onForcus={handleFocouse} id="profile" type="file" />
                                                    {errors.profile && <span className='text-xs text-red-500 inline-block'>{errors.profile}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add User' />
                                    </div>
                                </form>
                            </div>
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
                            <div className="relative bg-white dark:bg-gray-900 dark:text-gray-400 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Update User
                                    </h3>
                                    <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                </div>
                                <form onSubmit={handleUpdate} noValidate>
                                    <div className='p-5'>
                                        <div className='space-y-5'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>First Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.firstName} id='firstName' name='firstName' type='text' placeholder='Name' />
                                                    {errors.firstName && <span className='text-xs text-red-500 inline-block'>{errors.firstName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Last Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.lastName} id='lastName' name='lastName' type='text' placeholder='Name' />
                                                    {errors.lastName && <span className='text-xs text-red-500 inline-block'>{errors.lastName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Email :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.email} id='email' name='email' type='email' placeholder='Email' />
                                                    {errors.email && <span className='text-xs text-red-500 inline-block'>{errors.email}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Mobile No :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.mobile} id='mobile' name='mobile' type='number' placeholder='Mobile No' />
                                                    {errors.mobile && <span className='text-xs text-red-500 inline-block'>{errors.mobile}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Password :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.password} id='password' name='password' type='password' placeholder='Password' />
                                                    {errors.password && <span className='text-xs text-red-500 inline-block'>{errors.password}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Birth :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.dob} id='dob' name='dob' type='date' placeholder='Date Of Birth' />
                                                    {errors.dob && <span className='text-xs text-red-500 inline-block'>{errors.dob}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Join :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.doj} id='doj' name='doj' type='date' placeholder='Date Of Join' />
                                                    {errors.doj && <span className='text-xs text-red-500 inline-block'>{errors.doj}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch} onChange={handleChange} onFocus={handleFocouse} name='branch' options={options} />
                                                    {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Address :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.address} id='address' name='address' type='text' placeholder='Address' />
                                                    {errors.address && <span className='text-xs text-red-500 inline-block'>{errors.address}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>User Type :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='userType' value={values.userType} onChange={handleChange} onFocus={handleFocouse} name='userType' options={userTypeOptions} />
                                                    {errors.userType && <span className='text-xs text-red-500 inline-block'>{errors.userType}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Salary Package :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.salary} id='salary' name='salary' type='number' placeholder='Salary' />
                                                    {errors.salary && <span className='text-xs text-red-500 inline-block'>{errors.salary}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Profile :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput accept='image/*' name='profile' onChange={handleChange} onForcus={handleFocouse} id="profile" type="file" />
                                                    {errors.profile && <span className='text-xs text-red-500 inline-block'>{errors.profile}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeUpdateModal} />
                                        <OutlineButton type='submit' title='Update User' />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}

export default User
