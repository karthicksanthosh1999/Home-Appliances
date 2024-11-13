import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from 'react'
import SearchInput from '../../Components/Inputs/SearchInput';
import OutlineButton from '../../Components/Buttons/OutlineButton';
import axios from 'axios';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDeliveryThunk, fetchAllDeliveryThunk, fetchDeliverySuccess, getSigleDeliveryThunk, updateDeliveryThunk } from '../../Features/ActionTypes/deliveryActionTypes';
import { motion } from 'framer-motion';
import TableLoading from '../../Components/Loading/TableLoading';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import CancelButton from '../../Components/Buttons/CancelButton';
import { TDelivery } from '../../types/deliveryTypes';
import PlainInput from '../../Components/Inputs/PlainInput';
import Selects from '../../Components/Inputs/Selects';
import { fetchAllUserThunk } from '../../Features/ActionTypes/userActionsType';
import { BASE_URI } from '../../App';
import { IUserProps } from '../../Components/Navbar/TopBar';
import { renderAnimation } from '../../utilities/LoadingHelper';
import { useNavigate } from 'react-router-dom';

const Delivery: FC<IUserProps> = ({ user }) => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const { deliveryLoading, devliveryResponses, singleDelivery } = useSelector((state: Rootstate) => state.delivery)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [limit, _setLimit] = useState<number>(10);
    const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)
    const [branchErrors, setBranchErrors] = useState<Partial<TDelivery>>({})
    const [isLoading, setIsLoading] = useState<"loading" | "success" | "failure" | null>(null)
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [location, setLocation] = useState({ latitude: "", longitude: "" });
    const [values, setValues] = useState<TDelivery>({
        branchId: "",
        createdPerson: "",
        customerId: "",
        deliveryPersonId: "",
        installationProof: "",
        installedDate: "",
        invoiceId: "",
        lat: "",
        lang: "",
    })
    const { users } = useSelector((state: Rootstate) => state.user);
    const userOptions = users.map(item => {
        return {
            value: item._id,
            option: item.firstName
        }
    });

    useEffect(() => {
        axios.get(`${BASE_URI}/api/delivery/search-deliverys/?search=${searchTerm}&page=${page}&limit=${limit}&userId=${user?.userId}`,
            {
                withCredentials: true
            }
        ).then((res) => {
            const { pagination, branches } = res.data.responses;
            dispatch(fetchDeliverySuccess(branches));
            setTotalPages(pagination.totalPages)
            dispatch(fetchAllUserThunk())
            dispatch(fetchAllDeliveryThunk())
        }).catch((err) => {
            console.log(err)
        })

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude.toString().slice(0, 7),
                    longitude: position.coords.longitude.toString().slice(0, 7)
                })
            }, (error) => {
                console.log("Error getting location:", error.message)
                alert("Unable to retrieve your location. Please check location permissions.");
            })
        }

    }, [page, searchTerm, dispatch, limit, singleDelivery])

    const openDeleteModal = (id: string) => {
        setSelectedDelivery(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }
    // const openUpdateModal = (id: string) => {
    //     setSelectedDelivery(id);
    //     setIsUpdateModalOpen(true)
    // }
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false)
        formReset()
    }
    const openCreateModal = async (id: string) => {
        if (id) {
            dispatch(getSigleDeliveryThunk(id))
            setSelectedDelivery(id)
        }
        const res = await axios.get(`${BASE_URI}/api/delivery/single-delivery/${id}`, {
            withCredentials: true
        })
        const { responses } = res.data;
        setValues({
            branchId: responses?.branchId?._id || "",
            createdPerson: responses?.createdPerson?._id || "",
            customerId: responses?.customerId?._id || "",
            deliveryPersonId: responses?.deliveryPersonId?._id || "",
            installationProof: responses?.installationProof || "",
            installedDate: formatDateToYYYYMMDD(responses?.installedDate) || "",
            invoiceId: responses?.invoiceId?._id || "",
            lat: location?.latitude,
            lang: location?.longitude,
        })
        setIsCreateModalOpen(true)
    }
    // const openCreateModal = (id: string) => {
    //     if (id) {
    //         dispatch(getSigleDeliveryThunk(id))
    //         setSelectedDelivery(id)
    //     }
    //     if (singleDelivery) {
    //         setValues({
    //             branchId: singleDelivery?.branchId?._id || "",
    //             createdPerson: singleDelivery?.createdPerson?._id || "",
    //             customerId: singleDelivery?.customerId?._id || "",
    //             deliveryPersonId: singleDelivery?.deliveryPersonId?._id || "",
    //             installationProof: singleDelivery?.installationProof || "",
    //             installedDate: formatDateToYYYYMMDD(singleDelivery?.installedDate) || "",
    //             invoiceId: singleDelivery?.invoiceId?._id || "",
    //             lat: location?.latitude,
    //             lang: location?.longitude,
    //         })
    //     }
    //     setIsCreateModalOpen(true)
    // }
    const closeCreateModal = () => {
        formReset()
        setIsCreateModalOpen(false)
    }
    const openLoadingModal = () => {
        setIsLoading("loading")
        setIsLoadingModalOpen(true)
    }
    const closeLoadingModal = () => {
        setIsLoadingModalOpen(false)
        setIsLoading(null)
    }
    const handleDelete = () => {
        setIsLoading('loading')
        openLoadingModal()
        if (selectedDelivery) {
            setIsLoading('success')
            dispatch(deleteDeliveryThunk(selectedDelivery))
            setSelectedDelivery(null)
            closeDeleteModal()
            closeLoadingModal()
        }
        setIsLoading('failure')
        closeLoadingModal()
    }
    const handleValidation = (): Boolean => {
        const newError: Partial<TDelivery> = {};
        if (!values.installedDate) {
            newError.installedDate = "Delivery date is required!"
        }
        if (!values.deliveryPersonId) {
            newError.deliveryPersonId = "Delivery person is required!"
        }
        setBranchErrors(newError);

        return Object.keys(newError).length === 0;
    }
    const handleChangeDelivery: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (event) => {
        const { name, value, files } = event.target as HTMLInputElement;

        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImage(URL.createObjectURL(file))
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('File type not supported. Please upload a JPEG, PNG, or PDF file.');
                return;
            }

            // Store the file object directly in the state
            setValues((prevValues: any) => ({
                ...prevValues,
                [name]: file  // Store the file, not base64
            }));
        } else {
            setValues((prevValues: any) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        openLoadingModal();
        setIsLoading("loading");

        if (handleValidation()) {
            if (selectedDelivery) {
                // Initialize a FormData object
                const formData = new FormData();

                // Append each TDelivery property in `values` to formData
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value.toString()); // Ensure each value is appended as a string
                    }
                });
                try {
                    // Dispatch the action or make an API request using FormData
                    await dispatch(updateDeliveryThunk(selectedDelivery, formData));
                    setIsLoading("success");
                    setTimeout(() => {
                        closeLoadingModal();
                        navigate("/delivery");
                    }, 3000);
                } catch (error) {
                    setIsLoading("failure");
                    setTimeout(() => {
                        closeLoadingModal();
                    }, 3000);
                    console.error("Error submitting the form:", error);
                }
            }
        }

        closeCreateModal();
        setTimeout(() => {
            closeLoadingModal();
        }, 3000);
    };

    const formReset = () => {
        setSelectedImage("")
        setValues({
            branchId: "",
            createdPerson: "",
            customerId: "",
            deliveryPersonId: "",
            installationProof: "",
            installedDate: "",
            invoiceId: ""
        })
        setSelectedDelivery(null)
    }
    const handleUpdate = () => {
        console.log("Updated ")
    }
    return (
        <>
            <section>
                <div className="bg-white dark:bg-gray-900 mt-5">
                    <div className='p-5 flex justify-between gap-2 items-center '>
                        <div>
                            <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Deliverys</h1>
                        </div>
                        <div className='flex gap-2'>
                            <SearchInput placeholder='Search Branch Name' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            {/* <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} /> */}
                            {/* <OutlineButton title='Add New' type='button' /> */}
                        </div>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                // onChange={(event) => handleSelectAll(event.target.checked)}
                                                // checked={isAllSelected}
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
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Deliver Person Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Branch Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Invoice Id
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Installation Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Customer Addres
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    deliveryLoading ? (
                                        <tr>
                                            <td colSpan={8} className='text-center py-10'>
                                                <TableLoading />
                                            </td>
                                        </tr>
                                    ) : (
                                        devliveryResponses?.length === 0 ? (
                                            <tr className=''>
                                                <td colSpan={8} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                            </tr>
                                        ) : (
                                            devliveryResponses && devliveryResponses.map((item, i) => (
                                                <tr key={i} className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                    <td className="w-4 p-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                // checked={selectedUserIds.includes(item._id!)}
                                                                // onChange={() => handleCheckboxChange(item._id!)}
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
                                                        {item?.deliveryPersonId?.firstName} {" "}
                                                        {item?.deliveryPersonId?.lastName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item?.branchId?.branchName ? item?.branchId?.branchName : "-None-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item?.invoiceId?.invoiceNo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {formatDateToYYYYMMDD(item?.installedDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item?.status ? item?.status : "-None-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item?.customerId?.address ? item?.customerId?.address : "-None-"}
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-5">
                                                        {/* <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                            <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a> */}
                                                        <a href="#" className="font-medium text-black dark:hover:text-[#c60000] dark:text-gray-300 hover:text-[#C60000]">
                                                            <FontAwesomeIcon fontSize={15} icon={item.status === "Completed" ? faEye : faAdd} onClick={() => openCreateModal(item._id!)} /></a>
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
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
                                            Delete Delivery
                                        </h3>
                                        <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <h1 className='text-xl text-black dark:text-gray-400'>Are you sure, You want to delete the delivery?</h1>
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
                                    <div className="relative bg-white dark:bg-gray-900 text-black dark:text-gray-400 rounded-lg shadow" >
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                            <h3 className="text-xl font-semibold dark:text-gray-100 text-gray-900">
                                                {values ? "See" : "Update"} Delivery
                                            </h3>
                                            <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                        </div>
                                        <div className='p-5'>
                                            <div className='space-y-3'>
                                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                                    <h6 className='col-span-2 text-sm font-semibold'>Delivery Person :</h6>
                                                    <div className='col-span-3'>
                                                        <Selects
                                                            disable={true}
                                                            id='deliveryId'
                                                            name='deliveryPersonId'
                                                            value={values?.deliveryPersonId}
                                                            options={userOptions}
                                                            onChange={handleChangeDelivery}
                                                        />
                                                        {branchErrors.deliveryPersonId && <span className='text-xs text-red-500 inline-block'>{branchErrors.deliveryPersonId}</span>}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                                    <h6 className='col-span-2 text-sm font-semibold'>Installation Date :</h6>
                                                    <div className='col-span-3'>
                                                        <PlainInput id='installedDate' name='installedDate' value={values?.installedDate} onChange={handleChangeDelivery} type='date' placeholder='Date' />
                                                        {branchErrors.installedDate && <span className='text-xs text-red-500 inline-block'>{branchErrors.installedDate}</span>}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                                    <h6 className='col-span-2 text-sm font-semibold'>Image Update :</h6>
                                                    <div className='col-span-3'>
                                                        {
                                                            singleDelivery?.installationProof ? (
                                                                <img src={singleDelivery?.installationProof} alt="installationProof" />
                                                            ) : (
                                                                <div className="flex items-center justify-center w-full">
                                                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                                                                        {
                                                                            selectedImage ? (
                                                                                <div>
                                                                                    <img src={selectedImage} alt="selectedImage" />
                                                                                </div>
                                                                            ) : (
                                                                                <div>
                                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                                        </svg>
                                                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPAC</p>
                                                                                    </div>
                                                                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleChangeDelivery} name='installationProof' />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </label>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-5'>
                                                {
                                                    singleDelivery?.geoLocation ? (
                                                        <div className='grid grid-cols-5 justify-evenly items-center'>
                                                            <h6 className='col-span-2 text-sm font-semibold'>Address :</h6>
                                                            <div className='col-span-3'>
                                                                <p>{singleDelivery?.geoLocation?.address?.village}</p>
                                                                <p>{singleDelivery?.geoLocation?.address?.city}</p>
                                                                <p>{singleDelivery?.geoLocation?.address?.country}</p>
                                                                <p>{singleDelivery?.geoLocation?.address?.postcode}</p>
                                                                <p>{singleDelivery?.geoLocation?.address?.state_district}</p>
                                                            </div>
                                                        </div>
                                                    ) : (<div></div>)
                                                }

                                            </div>
                                        </div>
                                        <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                            <OutlineButton type='reset' title='Disacard' onclick={closeCreateModal} />
                                            <OutlineButton type='submit' title='Submit' />
                                        </div>
                                    </div>
                                </form>
                            </div >
                        </motion.div >
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
                                                    <h6 className='col-span-2 text-sm font-semibold'>Street :</h6>
                                                    <div className='col-span-3'>
                                                        <PlainInput id='installedDate' name='installedDate' value={values.installedDate} onChange={handleChangeDelivery} type='text' placeholder='City' />
                                                        {branchErrors.installedDate && <span className='text-xs text-red-500 inline-block'>{branchErrors.installedDate}</span>}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                                    <h6 className='col-span-2 text-sm font-semibold'>City :</h6>
                                                    <div className='col-span-3'>
                                                        <Selects
                                                            id='deliveryId'
                                                            name='deliveryPersonId'
                                                            value={values.deliveryPersonId}
                                                            options={userOptions}
                                                            onChange={handleChangeDelivery}
                                                        />
                                                        {branchErrors.deliveryPersonId && <span className='text-xs text-red-500 inline-block'>{branchErrors.deliveryPersonId}</span>}
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
                </div >
            </section >
        </>
    )
}

export default Delivery
