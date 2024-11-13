import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport, faFileUpload, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import CancelButton from '../../Components/Buttons/CancelButton';
import { motion } from "framer-motion"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import TableLoading from '../../Components/Loading/TableLoading';
import Selects from '../../Components/Inputs/Selects';
import { bulkUploadLeadThunk, createLeadThunk, deleteLeadThunk, fetchLeadSuccess, multipleDeleteLeadThunk, updateLeadThunk } from '../../Features/ActionTypes/leadActionTypes';
import { ILead } from '../../Features/Reducers/leadReducer';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import SearchInput from '../../Components/Inputs/SearchInput';
import axios from 'axios';
import PlainInput from '../../Components/Inputs/PlainInput';
import { leadReourcesOptions } from '../Customers/Customers';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { BASE_URI } from '../../App';

const LeadManagement: FC = () => {

    const statusOptions = [
        {
            option: "Open Lead",
            value: "openLead"
        },
        {
            option: "Close Lead",
            value: "closeLead"
        },
        {
            option: "Not Responding",
            value: "notResponding"
        },
        {
            option: "Declined",
            value: "declined"
        },
    ]

    const dispatch = useDispatch<AppDispatch>();
    const { leadLoading, leads } = useSelector((state: Rootstate) => state.lead)
    const { branches } = useSelector((state: Rootstate) => state.branch)
    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
    const [bulkImport, setBulkImport] = useState<any[]>([])
    const [page, setPage] = useState(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [errors, setErrors] = useState<Partial<ILead>>({})
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
    const [checkedLeadsIds, setCheckedLeadsIds] = useState<string[]>([])

    const [values, setValues] = useState<ILead>({
        address: "",
        suggestion: "",
        status: "",
        branch: "",
        customerName: "",
        email: "",
        remainder: "",
        knownVia: "",
        mobile: ""
    })

    const openDeleteModal = (id: string) => {
        setSelectedLeadId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const openUpdateModal = (id: string) => {
        fetchSelectedCustomer(id)
        setSelectedLeadId(id)
        setIsUpdateModalOpen(true)
    }
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false)
    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
    }
    const openBulkModal = () => setIsBulkModalOpen(true)
    const closeBulkModal = () => setIsBulkModalOpen(false)

    useEffect(() => {
        axios.get(`${BASE_URI}/api/lead/search-leads/?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, leads } = res.data.responses;
            dispatch(fetchLeadSuccess(leads));
            setTotalPages(pagination.totalPages)
        })
        dispatch(fetchAllBranchThunk())

    }, [dispatch, searchTerm, page, limit])

    const handleSingleCheckBox = (leadId: string) => {
        setCheckedLeadsIds((preV) =>
            preV.includes(leadId) ?
                preV.filter(id => id !== leadId) :
                [...preV, leadId]
        )
    }

    const handleAllCheckBox = (isChecked: boolean) => {
        if (isChecked) {
            const allLeadsIds = leads.map((item) => item._id).filter((id): id is string => id !== undefined);
            setCheckedLeadsIds(allLeadsIds);
        } else {
            setCheckedLeadsIds([])
        }
    }

    const isAllChecked = leads.length > 0 && checkedLeadsIds.length === leads.length;

    const handleDelete = () => {
        if (selectedLeadId) {
            dispatch(deleteLeadThunk(selectedLeadId))
            closeDeleteModal();
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (event) => {
        const { value, name } = event.target;
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
        const newErrors: Partial<ILead> = {};

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
        if (!values.remainder) {
            newErrors.remainder = "Remainder is required!"
        }
        if (!values.suggestion) {
            newErrors.suggestion = "Suggestion is required!"
        }
        if (!values.status) {
            newErrors.status = "Status is required!"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const formReset = () => {
        setValues({
            address: "",
            suggestion: "",
            status: "",
            branch: "",
            customerName: "",
            email: "",
            remainder: "",
            knownVia: "",
            mobile: "",
        })
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        console.log(values)
        if (handleValidation()) {
            dispatch(createLeadThunk(values))
            formReset();
            closeCreateModal()
        }
    }

    const fetchSelectedCustomer = async (id: string) => {
        await axios.get(`${BASE_URI}/api/lead/single-lead/${id}`, {
            withCredentials: true
        }).then((res) => {
            const reponse = res.data.responses
            setValues((preve) => ({
                ...preve,
                status: reponse?.status,
                updatedOn: reponse?.updatedOn,
                suggestion: reponse?.suggestion,
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
            if (selectedLeadId) {
                dispatch(updateLeadThunk(selectedLeadId, values))
                formReset();
                closeUpdateModal()
                setSelectedLeadId(null)
            }
        } else {
            console.log("Error in form validataion function")
        }
    }

    const handleMultipleDelete = () => {
        if (checkedLeadsIds) {
            dispatch(multipleDeleteLeadThunk(checkedLeadsIds))
            setCheckedLeadsIds([])
        }
    }

    const handleBulkChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const arrayBuffer = event.target?.result;
                if (arrayBuffer) {

                }
                const workbook = XLSX.read(arrayBuffer, { type: "array" })
                const sheetName = workbook.SheetNames[0];
                const workSheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(workSheet, { header: 1 }) as (string | number | null | undefined)[][];

                // Transform the data to array of objects
                const headers = jsonData[0] as string[]; // First row with headers
                const rows = jsonData.slice(1); // Data rows excluding headers

                // Map rows to objects using headers as keys
                const transformedData = rows.map((row) => {
                    const obj: any = {};
                    headers.forEach((header: string, index: number) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });
                setBulkImport(transformedData)
            };
            reader.readAsArrayBuffer(file)
        }
    }

    const handleBulkUpload = () => {
        dispatch(bulkUploadLeadThunk(bulkImport))
        closeBulkModal()
    }

    // Export Functions 
    const handleExport = async () => {
        try {
            if (checkedLeadsIds) {
                let ids: string[] = checkedLeadsIds;
                const res = await axios.post(`${BASE_URI}/api/lead/exports-leads`, { ids }, { responseType: "blob", withCredentials: true });
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Leads.xlsx');
                document.body.appendChild(link);
                link.click();
                toast.success("Export data successfully")
            }
        } catch (error: unknown) {
            console.log("Error from export function", error)
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 mt-5">
                <div className='p-5 flex justify-between gap-2 items-center'>
                    <div>
                        <h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900'>Lead Management</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Lead Name, Id' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {
                            checkedLeadsIds && checkedLeadsIds.length === 0 ? (
                                <div></div>
                            ) : (
                                <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} />
                            )
                        }
                        <OutlineButton title='Upload' type='button' icon={faFileUpload} onclick={openBulkModal} />
                        <OutlineButton title='Export' type='button' icon={faFileExport} onclick={handleExport} />
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            onChange={(event) => handleAllCheckBox(event.target.checked)}
                                            checked={isAllChecked}
                                            id="checkbox-all"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Mobile Number
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Email ID
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Lead ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Lead Resource
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Updated On
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Enquire For
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                leadLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    leads && leads.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        leads && leads.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={checkedLeadsIds.includes(item._id!)}
                                                            onChange={() => handleSingleCheckBox(item._id!)}
                                                            id="checkbox-table-1"
                                                            type="checkbox"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-900 border-gray-300 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                                                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.date!)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.customerName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.mobile}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.leadId}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.address}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.knownVia}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.updatedOn!)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {item.suggestion}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status}
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
                        <h3 className='dark:text-gray-400 text-gray-900'>Page {page} of {totalPages}</h3>
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
                            <div className="relative bg-white rounded-lg shadow" >
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Delete Lead
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl '>Are you sure, You want to delete this lead?</h1>
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
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold">
                                            Create Lead
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
                                                <h6 className='col-span-2 text-base font-semibold'>Lead Source :</h6>
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
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Status :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='status' value={values.status} onChange={handleChange} onFocus={handleFocuse} name='status' options={statusOptions} />
                                                    {errors.status && <span className='text-xs text-red-500 inline-block'>{errors.status}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Suggestion :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput value={values.suggestion} name="suggestion" onChange={handleChange} onForcus={handleFocuse} id='suggestion' type='text' placeholder='Suggestion' />
                                                    {errors.suggestion && <span className='text-xs text-red-500 inline-block'>{errors.suggestion}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-start'>
                                                <h6 className='col-span-2 text-base font-semibold'>Remainder:</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id="remainder" name='remainder' value={values.remainder} onChange={handleChange} type='date' onForcus={handleFocuse} placeholder="Remainder" />
                                                    {errors.remainder && <span className='text-xs text-red-500 inline-block'>{errors.remainder}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add Lead' />
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
                                <form onSubmit={handleUpdate} noValidate>
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Update Lead
                                        </h3>
                                        <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3 dark:text-gray-400 text-gray-900 '>
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
                                                <h6 className='col-span-2 text-base font-semibold'>Lead Resource:</h6>
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
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Status :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='status' value={values.status} onChange={handleChange} onFocus={handleFocuse} name='status' options={statusOptions} />
                                                    {errors.status && <span className='text-xs text-red-500 inline-block'>{errors.status}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Lead Resource :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='knownVia' value={values.knownVia} onChange={handleChange} onFocus={handleFocuse} name='knownVia' options={leadReourcesOptions} />
                                                    {errors.knownVia && <span className='text-xs text-red-500 inline-block'>{errors.knownVia}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-start'>
                                                <h6 className='col-span-2 text-base font-semibold'>Feedback:</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput id="remainder" type='date' name='remainder' value={values.remainder} onChange={handleChange} onForcus={handleFocuse} placeholder="Feedback"></PlainInput>
                                                    {errors.remainder && <span className='text-xs text-red-500 inline-block'>{errors.remainder}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeUpdateModal} />
                                        <OutlineButton type='submit' title='Update Lead' />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* BULK MODAL */}
                {isBulkModalOpen && (
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
                                        Bulk Upload
                                    </h3>
                                    <CancelButton onClick={closeBulkModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <PlainInput accept=".xlsx, .xls" name='bulkUpload' onChange={handleBulkChange} onForcus={handleFocuse} id='bulkUpload' type='file' />
                                </div>
                                <div className='flex justify-end p-5 gap-2'>
                                    <OutlineButton type='reset' title='Cancel' onclick={closeBulkModal} />
                                    <OutlineButton disabled={bulkImport.length === 0} type='button' title='Add' onclick={handleBulkUpload} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}

export default LeadManagement
