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
import { createEmployeeThunk, deleteEmployeeThunk, fetchEmployeeSuccess, updateEmployeeThunk } from '../../Features/ActionTypes/employeeActionTypes';
import TableLoading from '../../Components/Loading/TableLoading';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import SearchInput from '../../Components/Inputs/SearchInput';
import axios from 'axios';
import { BASE_URI } from '../../App';


export interface IEmployeeInput {
    employeeName: string,
    branch: string,
    mobile: string,
    email: string,
    address: string,
    dob: string,
    doj: string,
    salary: string,
    idProof: string,
}
const Employees: FC = () => {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<IEmployeeInput>>({})
    const [page, setPage] = useState<number>(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
    const [values, setValues] = useState<IEmployeeInput>({
        employeeName: "",
        branch: "",
        mobile: "",
        email: "",
        address: "",
        dob: "",
        doj: "",
        salary: "",
        idProof: "",
    })

    const openDeleteModal = (id: string) => {
        setSelectedEmployeeId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setSelectedEmployeeId(null)
    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
        formReset()
    }
    const openUpdateModal = async (id: string) => {
        setSelectedEmployeeId(id)
        setIsUpdateModalOpen(true)
        await axios.get(`${BASE_URI}/api/employee/single-employee/${id}`, { withCredentials: true }).then((res) => {
            const reponse = res.data.responses
            setValues((preve) => ({
                ...preve,
                address: reponse?.address,
                branch: reponse?.branch?._id,
                employeeName: reponse?.employeeName,
                email: reponse?.email,
                mobile: reponse?.mobile,
                dob: reponse?.dob,
                doj: reponse?.doj,
                idProof: reponse?.idProof,
                salary: reponse?.salary,
            }))

        }).catch((err) => console.log(err))
    }
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false)
        formReset()
        setSelectedEmployeeId(null)
    }
    const dispatch = useDispatch<AppDispatch>()

    const { branches } = useSelector((state: Rootstate) => state.branch)
    const { employeeLoading, employees } = useSelector((state: Rootstate) => state.employee)
    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });

    useEffect(() => {
        axios.get(`${BASE_URI}/api/employee/search-employees/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, employees } = res.data.responses;
            console.log(res.data.responses)
            dispatch(fetchEmployeeSuccess(employees));
            setTotalPage(pagination.totalPages)
        }).catch((err) => console.log(err))
        dispatch(fetchAllBranchThunk())
    }, [dispatch, searchTerm, page, limit])

    const formReset = () => {
        setValues({
            employeeName: "",
            branch: "",
            mobile: "",
            email: "",
            address: "",
            dob: "",
            doj: "",
            salary: "",
            idProof: "",
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
        const newErrors: Partial<IEmployeeInput> = {};

        if (!values.employeeName) {
            newErrors.employeeName = "Employee name is required!"
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
        if (!values.doj) {
            newErrors.doj = "DOJ is required!"
        }
        if (!values.branch) {
            if (newErrors.branch) {
                newErrors.branch = "Branch name is required!";
            }
        }
        if (!values.salary) {
            newErrors.salary = "Salary is required!"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            dispatch(createEmployeeThunk(values))
            closeCreateModal()
            formReset()
        }
    }

    const handleUpdate: FocusEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            if (selectedEmployeeId) {
                dispatch(updateEmployeeThunk(selectedEmployeeId, values))
                closeUpdateModal()
                formReset()
                setSelectedEmployeeId(null)
            }
        }
    }

    const handleDelete = () => {
        if (selectedEmployeeId) {
            dispatch(deleteEmployeeThunk(selectedEmployeeId))
            closeDeleteModal()
            setSelectedEmployeeId(null)
        }
    }

    return (
        <>
            <div className='bg-white dark:bg-gray-900 mt-5'>
                <div className='p-5 flex justify-between gap-2 items-center mt-5'>
                    <div>
                        <h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900 '>Employees</h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <OutlineButton title='Filter' type='button' icon={faFilter} /> */}
                        <SearchInput placeholder='Search name, id' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Email ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Employee ID
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
                                employeeLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    employees && employees.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={12} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        employees && employees.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600" key={i}>
                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                                    <img className="w-10 h-10 rounded-full" src={item.idProof} alt="Jese image" />
                                                    <div className="ps-3">
                                                        <div className="text-base font-semibold dark:text-gray-100">{item.employeeName}</div>
                                                        <div className="font-normal text-gray-500 dark:text-gray-100">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.branch?.branchName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.mobile}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.address}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.employeeId}
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
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-[#C60000] hover:text-[#C60000]">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-[#C60000] hover:text-[#C60000]">
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
                        <h3 className='dark:text-gray-400 bg-gray-900'>Page {page} of {totalPage}</h3>
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Delete Employee
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl dark:text-gray-400 text-gray-900'>Are you sure, You want to delete the employee?</h1>
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Create Employee
                                    </h3>
                                    <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                </div>
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className='p-5 dark:text-gray-400 text-gray-400'>
                                        <div className='space-y-5'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.employeeName} id='employeeName' name='employeeName' type='text' placeholder='Name' />
                                                    {errors.employeeName && <span className='text-xs text-red-500 inline-block'>{errors.employeeName}</span>}
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
                                                <h6 className='col-span-2 text-base font-semibold'>Salary Package :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.salary} id='salary' name='salary' type='number' placeholder='Salary' />
                                                    {errors.salary && <span className='text-xs text-red-500 inline-block'>{errors.salary}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>ID Proof :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput accept='image/*' name='idProof' onChange={handleChange} onForcus={handleFocouse} id="idProof" type="file" />
                                                    {errors.idProof && <span className='text-xs text-red-500 inline-block'>{errors.idProof}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add Employee' />
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
                            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Update Employee
                                    </h3>
                                    <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                </div>
                                <form onSubmit={handleUpdate} noValidate>
                                    <div className='p-5 dark:text-gray-400 text-gray-400'>
                                        <div className='space-y-5'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.employeeName} id='employeeName' name='employeeName' type='text' placeholder='Name' />
                                                    {errors.employeeName && <span className='text-xs text-red-500 inline-block'>{errors.employeeName}</span>}
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
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Birth :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={formatDateToYYYYMMDD(values.dob)} id='dob' name='dob' type='date' placeholder='Date Of Birth' />
                                                    {errors.dob && <span className='text-xs text-red-500 inline-block'>{errors.dob}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Date Of Join :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={formatDateToYYYYMMDD(values.doj)} id='doj' name='doj' type='date' placeholder='Date Of Join' />
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
                                                <h6 className='col-span-2 text-base font-semibold'>Salary Package :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onForcus={handleFocouse} onChange={handleChange} value={values.salary} id='salary' name='salary' type='number' placeholder='Salary' />
                                                    {errors.salary && <span className='text-xs text-red-500 inline-block'>{errors.salary}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>ID Proof :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput accept='image/*' name='idProof' onChange={handleChange} onForcus={handleFocouse} id="idProof" type="file" />
                                                    {errors.idProof && <span className='text-xs text-red-500 inline-block'>{errors.idProof}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeUpdateModal} />
                                        <OutlineButton type='submit' title='Update Employee' />
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

export default Employees
