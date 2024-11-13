import { ChangeEvent, ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from 'react'
import logo from '../../../public/logo.svg'
import Hr from '../../Components/Lines/Hr'
import { formatDateToYYYYMMDD } from '../../utilities/help'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, Rootstate } from '../../Features/Store'
import { fetchAllUserThunk } from '../../Features/ActionTypes/userActionsType'
import { createDeliveryThunk, fetchAllDeliveryThunk } from '../../Features/ActionTypes/deliveryActionTypes'
import { BASE_URI } from '../../App'
import PlainInput from '../../Components/Inputs/PlainInput'
import { IUser } from '../../Features/Reducers/userReducer'
import Selects from '../../Components/Inputs/Selects'
import { TDelivery, TDeliveryResponse } from '../../types/deliveryTypes'
import AddButton from '../../Components/Buttons/AddButton'
import { IUserProps } from '../../Components/Navbar/TopBar'
import { renderAnimation } from '../../utilities/LoadingHelper';
import { motion } from 'framer-motion';
import { IGiftAssign, IGiftAssignResponses } from '../../types/giftAssignTypes'
import { IInvoice } from '../../types/invoiceTypes'
import { fetchAllGiftThunk } from '../../Features/ActionTypes/giftActionTypes'
import { createGiftAssignThunk, fetchAllGiftAssignThunk } from '../../Features/ActionTypes/giftAssignActionTypes'

const SingleInvoice: FC<IUserProps> = ({ user }) => {
    const { invoiceId } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const { users } = useSelector((state: Rootstate) => state.user);
    const { devliveryResponses } = useSelector((state: Rootstate) => state.delivery);
    const { giftsResponses } = useSelector((state: Rootstate) => state.gift);
    // const { giftAssignResponse } = useSelector((state: Rootstate) => state.giftAssign);
    const [invoices, setInvoices] = useState<IInvoice | null>(null)
    const [branchErrors, setBranchErrors] = useState<Partial<TDelivery>>({})
    const [selectedUser, _setSelected] = useState<IUser | null>(null)
    const [isExistingDelivery, setIsExistingDelivery] = useState<TDeliveryResponse | null>(null)
    const [isLoading, setIsLoading] = useState<"loading" | "success" | "failure" | null>(null)
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [values, setValues] = useState<TDelivery>({
        branchId: user?.branch || "",
        createdPerson: selectedUser?._id || "",
        deliveryPersonId: "",
        installationProof: "",
        installedDate: "",
        invoiceId: invoiceId || ""
    })
    const userOptions = users.map(item => {
        return {
            value: item._id,
            option: item.firstName
        }
    });
    const giftOptions = giftsResponses.map(item => {
        return {
            value: item._id,
            option: item.giftName
        }
    });
    const [isVisible, setIsVisible] = useState<boolean>()
    // const [isGiftVisible, setIsGiftVisible] = useState<boolean>()
    const [existingGift, setExistingGift] = useState<IGiftAssignResponses>()
    const [giftAssign, setGiftAssign] = useState<IGiftAssign>({
        invoiceId: invoiceId || "",
        gifttId: "",
        quantity: ""
    })

    useEffect(() => {
        dispatch(fetchAllGiftThunk())
        axios.get(`${BASE_URI}/api/invoice/single-invoice/${invoiceId}`, { withCredentials: true }).then(res => {
            setInvoices(res.data.responses)
        }).catch(err => console.log(err))
        dispatch(fetchAllUserThunk())
        dispatch(fetchAllDeliveryThunk())
        dispatch(fetchAllGiftAssignThunk())
        const existingDelivery = devliveryResponses.find((item) => item.invoiceId?._id === invoiceId);
        if (existingDelivery) {
            setIsExistingDelivery(existingDelivery);
            setIsVisible(true)
        } else {
            setIsExistingDelivery(null);
            setIsVisible(false)
        }
        axios.get(`${BASE_URI}/api/giftAssign/find-gift/${invoiceId}`, { withCredentials: true }).then(res => {
            setExistingGift(res.data.responses)
            console.log(res.data.responses, invoiceId)
            // dispatch(fetchGiftAssignSingle(res.data.responses))
            console.log(res.data.responses)
            // setIsGiftVisible(true)
        }).catch(err => console.log(err))
    }, [dispatch])



    const openLoadingModal = () => {
        setIsLoading("loading")
        setIsLoadingModalOpen(true)
    }
    const closeLoadingModal = () => {
        setIsLoadingModalOpen(false)
        setIsLoading(null)
    }
    const handleChangeDelivery: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (event) => {
        const { name, value, files } = event.target as HTMLInputElement;

        if (files && files.length > 0) {
            const file = files[0];

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('File type not supported. Please upload a JPEG, PNG, or PDF file.');
                return;
            }

            // Store the file object directly in the state
            setValues((prevValues) => ({
                ...prevValues,
                [name]: file  // Store the file, not base64
            }));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };
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
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        openLoadingModal()
        setIsLoading('loading')
        if (handleValidation()) {
            // Create a FormData object to handle file upload
            const formData = new FormData();

            // Append all values to formData, including the file
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString()); // Ensure each value is appended as a string
                }
            });

            try {
                // Dispatch the action or make an API request using FormData
                dispatch(createDeliveryThunk(formData));  // Ensure the thunk/action handles FormData
                setIsLoading("success")
                setTimeout(() => {
                    closeLoadingModal()
                    navigate("/delivery")
                }, 3000);
                setIsVisible(true)
            } catch (error) {
                console.error('Error submitting the form:', error);
                setIsLoading("failure")
                setTimeout(() => {
                    closeLoadingModal()
                }, 3000)
                setIsVisible(false)
            }
        }
        setTimeout(() => {
            closeLoadingModal()
        }, 3000);
    };
    // The handleGiftMethod function
    const handleGiftOnChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setGiftAssign((preV) => ({
            ...preV, [name]: value
        }))
    }
    const handleGiftSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (giftAssign) {
            dispatch(createGiftAssignThunk(giftAssign))
            navigate('/invoice')
        }
    }

    return (
        <>
            <section className="max-w-full">
                <div className='mt-5'>
                    <h1 className='text-black dark:text-gray-100 text-2xl font-semibold'>Invoice Details</h1>
                </div>
                <div className='bg-[#f3f3f3] dark:bg-gray-900 m-5'>
                    {/* HEADER */}
                    <div className="flex justify-between p-5 dark:text-gray-100 text-black">
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
                        <div className='dark:text-gray-100'>
                            <h1>Bill To:</h1>
                            <Hr />
                            <div>
                                <h1>{invoices?.customerDetails.customerName}</h1>
                                <h1>{invoices?.customerDetails?.mobile}</h1>
                                <h1>{invoices?.customerDetails?.email}</h1>
                                <h1>{invoices?.customerDetails?.address}</h1>
                            </div>
                        </div>
                        {/* BILL TABLE */}
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                            <table className="w-full text-sm text-left rtl:text-right dark:text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900">
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
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Products Purchased
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        invoices?.products && invoices?.products.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                <td className="px-6 py-4" key={i}>
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {invoices.invoiceNo ? invoices.invoiceNo : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(item.purchasedDate) ? formatDateToYYYYMMDD(item.purchasedDate) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {invoices.customerDetails.customerName ? invoices.customerDetails.customerName : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* {item.branch} */}
                                                    Madurai
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {invoices.customerDetails.customerName ? invoices.customerDetails.customerName : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {invoices.customerDetails.mobile ? invoices.customerDetails.mobile : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {invoices.customerDetails.email ? invoices.customerDetails.email : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDateToYYYYMMDD(item.purchasedDate)}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {invoices.prices.total ? invoices.prices.total : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {invoices.prices.paid ? invoices.prices.paid : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {invoices.prices.pending ? invoices.prices.pending : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* Price Details */}
                        <div className="bg-[#fff] dark:bg-gray-900">
                            <div className='p-5 mt-5 dark:text-gray-100 text-black'>
                                <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5  dark:bg-gray-900">
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Additional Charges :</h6>
                                        <div className='col-span-1'>
                                            <h1>{invoices?.prices.additionalCharges}</h1>
                                        </div>
                                    </div>
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Add Discount :</h6>
                                        <div className='col-span-1'>
                                            <h1>{invoices?.prices.addDiscount}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Payment Type :</h6>
                                        <div className='col-span-1'>
                                            <h1>{invoices?.prices.paymentMethod}</h1>
                                        </div>
                                    </div>

                                </div>
                                <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Paid :</h6>
                                        <div className='col-span-1'>
                                            <h1>{invoices?.prices.paid}</h1>
                                        </div>
                                    </div>
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Pending:</h6>
                                        <div className='col-span-1'>
                                            <h1 className='text-xl text'>Rs :{invoices?.prices.pending ? invoices?.prices.pending : " 0"}</h1>
                                        </div>
                                    </div>
                                    <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Total Price :</h6>
                                        <div className='col-span-1'>
                                            <h1 className='text-xl text'>Rs :{invoices?.prices.total ? invoices?.prices.total : " 0"}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Delivery */}
                <div className='dark:bg-gray-900 bg-white m-5 text-black dark:text-gray-100 '>
                    <h1 className='text-2xl font-semibold p-5'>{isVisible ? "Assigned Delivery Person" : "Assign Delivery"}</h1>
                    {
                        isVisible && isVisible ? (
                            <div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Delivery Person
                                            </th>
                                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Mobile Number
                                            </th>
                                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Branch Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Installation Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isExistingDelivery?.deliveryPersonId?.firstName} {" "}
                                                    {isExistingDelivery?.deliveryPersonId?.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isExistingDelivery?.deliveryPersonId?.mobile}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isExistingDelivery?.branchId?.branchName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isExistingDelivery?.status}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(isExistingDelivery?.installedDate)}
                                                </td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className='p-5 grid grid-row-3 gap-5'>
                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 text-sm font-semibold'>Delivery Person :</h6>
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
                                <div className='grid grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 text-sm font-semibold'>Installation Date :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput id='installedDate' name='installedDate' value={values.installedDate} onChange={handleChangeDelivery} type='date' placeholder='Date' />
                                        {branchErrors.installedDate && <span className='text-xs text-red-500 inline-block'>{branchErrors.installedDate}</span>}
                                    </div>
                                </div>
                                <div className='flex justify-end items-end gap-5'>
                                    <AddButton type='reset' title='Reset' />
                                    <AddButton type='submit' title='Assign' />
                                </div>
                            </form>
                        )
                    }
                </div >
                {/* Gifts  */}
                <div className='dark:bg-gray-900 bg-white m-5 text-black dark:text-gray-100 '>
                    {
                        existingGift && existingGift ? (
                            <div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Gift Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Gift Qantiry
                                            </th>
                                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                                Gift Value
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Assigned Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {existingGift?.gifttId?.giftName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {existingGift?.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {existingGift?.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDateToYYYYMMDD(existingGift?.assignedDate)}
                                                </td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <form onSubmit={handleGiftSubmit}>
                                <div className="dark:bg-gray-900 w-full h-auto p-5 space-y-5">
                                    <h1 className='dark:text-gray-100 text-gray-900 text-xl font-bold'>Gift Assign section</h1>
                                    <div className='grid grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-2 dark:text-gray-100 text-gray-900 text-sm font-semibold'>Gift Name :</h6>
                                        <div className='col-span-3'>
                                            <Selects
                                                id='gifttId'
                                                name='gifttId'
                                                value={giftAssign.gifttId}
                                                options={giftOptions}
                                                onChange={handleGiftOnChange}
                                            />
                                            {/* {branchErrors.deliveryPersonId && <span className='text-xs text-red-500 inline-block'>{branchErrors.deliveryPersonId}</span>} */}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-5 justify-evenly items-center'>
                                        <h6 className='col-span-2 text-sm font-semibold dark:text-gray-100 text-gray-900'>Gift count:</h6>
                                        <div className='col-span-3'>
                                            <PlainInput
                                                id='quantity'
                                                name='quantity'
                                                type='text'
                                                placeholder='Gift Count'
                                                value={giftAssign.quantity}
                                                onChange={handleGiftOnChange}
                                            />
                                            {/* {branchErrors.quantity && <span className='text-xs text-red-500 inline-block'>{branchErrors.quantity}</span>} */}
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-end gap-5'>
                                        <AddButton type='reset' title='Reset' />
                                        <AddButton type='submit' title='Assign' />
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
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
            </section >
        </>
    )
}

export default SingleInvoice
