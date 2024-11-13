import { ChangeEvent, ChangeEventHandler, FC, FormEvent, useEffect, useState } from 'react'
import PlainInput from '../../Components/Inputs/PlainInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import AddButton from '../../Components/Buttons/AddButton'
import Selects from '../../Components/Inputs/Selects'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, Rootstate } from '../../Features/Store'
import { fetchAllProductThunk } from '../../Features/ActionTypes/productActionTypes'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BASE_URI } from '../../App';
import { leadReourcesOptions } from '../Customers/Customers';
import { ICustomer } from '../../types/customerTypes';
import { IUserProps } from '../../Components/Navbar/TopBar'
import { formatDateToYYYYMMDD } from '../../utilities/help'
import { IGiftAssignment } from '../../types/giftAssignTypes'
import { fetchAllGiftThunk } from '../../Features/ActionTypes/giftActionTypes'

export interface IProducts {
    productId: string,
    productName: string,
    category: string,
    productPrice: string,
    brand: string,
    quantity: string | number
}

export interface IPriceDetails {
    additionalCharges: string,
    addDiscount: string,
    paymentMethod: string,
    paid: string,
    pending: string,
    total: string | number,
    gst: string
}

export interface IBackendProduct {
    purchasedDate: Date,
    productId: string,
    quentity: number
}

const AddInvoice: FC<IUserProps> = ({ user }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { productResonse } = useSelector((state: Rootstate) => state.product);
    const { giftsResponses } = useSelector((state: Rootstate) => state.gift);
    const options = (productResonse ?? []).map(item => {
        return {
            value: item._id,
            option: item.productName
        }
    });
    useEffect(() => {
        dispatch(fetchAllProductThunk())
        dispatch(fetchAllGiftThunk())
    }, [dispatch])

    const giftOptions = giftsResponses.map(item => {
        return {
            value: item._id,
            option: item.giftName
        }
    });

    const [customerDetails, setCustomerDetails] = useState<ICustomer>({
        customerName: "",
        mobile: "",
        email: "",
        address: "",
        knownVia: "",
        feedBack: "",
        date: ""
    })
    const [productList, setProductList] = useState<IProducts[]>([{
        brand: "",
        category: "",
        productId: "",
        productName: "",
        productPrice: "",
        quantity: ""
    }])
    const [priceDetails, setPriceDetails] = useState<IPriceDetails>({
        additionalCharges: "",
        addDiscount: "",
        paymentMethod: "",
        paid: "",
        pending: "",
        total: "",
        gst: "18"
    })
    const [giftAssign, setGiftAssign] = useState<IGiftAssignment>({
        gifttId: "",
        quantity: "",
    })

    const paymentTypeOptions = [
        {
            value: "online",
            option: "Online"
        },
        {
            value: "cash",
            option: "Cash"
        },
        {
            value: "card",
            option: "Card"
        },
    ]

    const handleAdd = () => {
        setProductList([...productList, {
            brand: '',
            category: '',
            productId: "",
            productName: "",
            productPrice: '',
            quantity: ""
        }])
    }

    const handleRemove = (e: number) => {
        const removeProducts = productList.filter((_, id) => id !== e)
        setProductList(removeProducts)
    }
    // Helper function to calculate total
    const calculateTotal = (productResonse: typeof productList, discount: number = 0, additionalCharges: number = 0, paid: number = 0, gst: number = 18) => {
        const totalBeforeAdjustments = productResonse.reduce(
            (acc, product) => acc + (Number(product.productPrice) * Number(product.quantity)),
            0
        );

        // Apply discount and additional charges
        const totalAfterDiscount = totalBeforeAdjustments - discount;
        const totalAfterCharges = totalAfterDiscount + additionalCharges;

        // Calculate GST on the total after additional charges
        const gstAmount = (totalAfterCharges * gst) / 100;

        // Add GST amount to the total
        const totalWithGst = totalAfterCharges + gstAmount;

        // Final total after subtracting the paid amount
        const finalTotal = totalWithGst - paid;

        return finalTotal > 0 ? finalTotal : 0;
    };

    const handleChange = async (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const { name, value } = event.target;
        const updateInvoice = [...productList];

        if (name === 'productName') {
            try {
                const res = await axios.get(`${BASE_URI}/api/product/single-product/${value}`, {
                    withCredentials: true
                });
                const response = res.data.responses;
                updateInvoice[index] = {
                    ...updateInvoice[index],
                    productId: response.productId,
                    category: response.category,
                    brand: response.brand,
                    productPrice: response.mrp,
                    productName: value,
                    quantity: updateInvoice[index].quantity || 1  // Keep existing quantity or set to 1
                };

                // Update productList
                setProductList(updateInvoice);

                // Recalculate total
                const total = calculateTotal(updateInvoice, Number(priceDetails.addDiscount), Number(priceDetails.additionalCharges), Number(priceDetails.paid));
                setPriceDetails((prevDetails) => ({
                    ...prevDetails,
                    total: total.toString(),
                }));
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        } else if (name === "quantity") {
            updateInvoice[index] = {
                ...updateInvoice[index],
                [name]: value,
            };

            // Update productList
            setProductList(updateInvoice);

            // Recalculate total
            const total = calculateTotal(updateInvoice, Number(priceDetails.addDiscount), Number(priceDetails.additionalCharges), Number(priceDetails.paid));
            setPriceDetails((prevDetails) => ({
                ...prevDetails,
                total: total.toString(),
            }));
        } else {
            updateInvoice[index] = {
                ...updateInvoice[index],
                [name]: value,
            };

            // Update productList
            setProductList(updateInvoice);
        }
    };

    // Handle Discount Change
    const handleDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const discount = Number(value) || 0;

        // Recalculate total after applying discount
        const total = calculateTotal(productList, discount, Number(priceDetails.additionalCharges), Number(priceDetails.paid));

        setPriceDetails((prevDetails) => ({
            ...prevDetails,
            addDiscount: discount.toString(),
            total: total.toString(),
        }));
    };

    // Handle Paid Change
    const handlePaidChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const paid = Number(value) || 0;

        // Recalculate total after accounting for paid amount
        const total = calculateTotal(productList, Number(priceDetails.addDiscount), Number(priceDetails.additionalCharges), paid);

        setPriceDetails((prevDetails) => ({
            ...prevDetails,
            paid: paid.toString(),
            // total: total.toString(),
            pending: total.toString()
        }));
    };

    // Handle Additional Charges Change
    const handleAdditionalChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const additionalCharges = Number(value) || 0;

        // Recalculate total after adding additional charges
        const total = calculateTotal(productList, Number(priceDetails.addDiscount), additionalCharges, Number(priceDetails.paid));

        setPriceDetails((prevDetails) => ({
            ...prevDetails,
            additionalCharges: additionalCharges.toString(),
            total: total.toString(),
        }));
    };

    // Handle GST Charges Change
    const handleAdditionalGstChanges = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const gstCharges = Number(value) || 0;

        const total = calculateTotal(
            productList,
            Number(priceDetails.addDiscount),
            Number(priceDetails.additionalCharges),
            Number(priceDetails.paid),
            gstCharges
        );

        setPriceDetails((prevDetails) => ({
            ...prevDetails,
            gst: gstCharges.toString(),
            total: total.toString(),
        }));
    };

    // The handlePaymentMethod function definition
    const handlePaymentMethod = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setPriceDetails((prevDetails) => ({
            ...prevDetails,
            paymentMethod: value,
        }));
    };

    // The handleGiftMethod function
    const handleGiftOnChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setGiftAssign((preV) => ({
            ...preV, [name]: value
        }))
    }

    const customerHandleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name, value } = event.target
        setCustomerDetails((preValue) => ({
            ...preValue, [name]: value
        }))
    }

    // Prepare the backend data structure
    const prepareInvoiceData = () => {
        const transformedProductList = productList.map(product => ({
            productId: product.productName,
            quentity: product.quantity
        }))
        const invoiceData = {
            branchId: user?.branch,
            customerDetails: {
                customerName: customerDetails.customerName,
                mobile: customerDetails.mobile,
                email: customerDetails.email,
                address: customerDetails.address,
                knownVia: customerDetails.knownVia,
                feedBack: customerDetails.feedBack,
                date: formatDateToYYYYMMDD(),
                branch: user?.branch,

            },
            products: transformedProductList,
            prices: {
                additionalCharges: priceDetails.additionalCharges,
                addDiscount: priceDetails.addDiscount,
                paymentMethod: priceDetails.paymentMethod,
                paid: priceDetails.paid,
                pending: priceDetails.pending,
                gst: priceDetails.gst,
                total: priceDetails.total
            },
            ...(giftAssign && giftAssign.gifttId && giftAssign.quantity && {
                giftAssignMent: {
                    gifttId: giftAssign.gifttId,
                    quantity: giftAssign.quantity,
                }
            })
        }
        return invoiceData
    }

    // Submit the invoice
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const invoiceData = prepareInvoiceData();
        try {
            const res = await axios.post(`${BASE_URI}/api/invoice/create-invoice`, invoiceData, {
                withCredentials: true
            })
            toast.success(res.data.message)
            navigate('/invoice')
        } catch (error) {
            console.error("Error submitting invoice", error)
            toast.error("Error in invoice createion")
        }
    }
    console.log(prepareInvoiceData())
    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                {/* Customer Details */}
                <div className="bg-[#fff] dark:bg-gray-900 dark:text-gray-100">
                    <div className='p-5 mt-5'>
                        <h1 className='text-2xl font-semibold'>Customer Details</h1>
                        <div className='grid md:grid-cols-2 grid-cols-1 gap-5 md:mt-10 mt-0'>
                            <div className='space-y-5'>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Customer Name :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput
                                            id='customerName'
                                            name='customerName'
                                            type='text'
                                            value={customerDetails.customerName}
                                            placeholder='Customer Name'
                                            onChange={customerHandleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Mobile :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput
                                            id='mobile'
                                            name='mobile'
                                            type='text'
                                            placeholder='Mobile'
                                            value={customerDetails.mobile}
                                            onChange={customerHandleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Email Address :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput
                                            id='email'
                                            name='email'
                                            type='email'
                                            placeholder='Email Address'
                                            value={customerDetails.email}
                                            onChange={customerHandleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-5'>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Address :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput id='address'
                                            name='address'
                                            type='text'
                                            placeholder='Address'
                                            value={customerDetails.address}
                                            onChange={customerHandleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Lead Resources :</h6>
                                    <div className='col-span-3'>
                                        <Selects
                                            id='knownVia'
                                            name='knownVia'
                                            value={customerDetails.knownVia}
                                            onChange={customerHandleChange}
                                            options={leadReourcesOptions}
                                        />
                                    </div>
                                </div>
                                <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                    <h6 className='col-span-2 lg:block hidden text-sm font-semibold'>Feedback :</h6>
                                    <div className='col-span-3'>
                                        <PlainInput id='feedBack'
                                            name='feedBack'
                                            type='email'
                                            placeholder='Feedback'
                                            value={customerDetails.feedBack}
                                            onChange={customerHandleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Products Details */}
                <div className="bg-[#fff] dark:bg-gray-900 dark:text-gray-100">
                    <div className='p-5 mt-5'>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
                            <table className="w-screen max-w-screen-xl text-sm text-center rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            S.No
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Product Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Product ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Brand
                                        </th>
                                        <th scope="col" className="px-10 py-3 whitespace-nowrap">
                                            Product Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productList && productList.map((item, i) => (
                                        <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50">
                                            <td className="px-3 py-4">
                                                {i + 1}
                                            </td>
                                            <td className="px-3 py-4">
                                                <Selects options={options} id='productName' onChange={(e) => handleChange(e, i)} name='productName' value={item.productName} />
                                            </td>
                                            <td className="px-3 py-4">
                                                <PlainInput id='productId' name='productId' type='text' placeholder='Product ID' value={item.productId} readOnly />
                                            </td>
                                            <td className="px-3 py-4">
                                                <PlainInput id='category' name='category' type='text' placeholder='Category' value={item.category} />
                                            </td>
                                            <td className="px-3 py-4">
                                                <PlainInput id='brand' name='brand' type='text' placeholder='Brand' value={item.brand} />
                                            </td>
                                            <td className="px-3 py-4">
                                                <PlainInput id='productPrice' name='productPrice' type='text' placeholder='Price' value={item.productPrice} />
                                            </td>
                                            <td className="px-3 py-4">
                                                <PlainInput id='quantity' name='quantity' type='text' placeholder='0' value={item.quantity} onChange={(e) => handleChange(e, i)} />
                                            </td>
                                            <td className="px-3 py-4 flex items-center justify-center gap-5">
                                                <button type='button' onClick={() => handleRemove(i)} className="font-medium text-black hover:text-[#C60000]">
                                                    <FontAwesomeIcon fontSize={15} icon={faTrash} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-white border-b border-gray-300 hover:bg-gray-50 dark:bg-gray-900">
                                        <td className="px-6 text-center py-4" colSpan={9}>
                                            <OutlineButton title='Add more + ' type='button' onclick={handleAdd} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Price Details */}
                <div className="bg-[#fff] dark:bg-gray-900 dark:text-gray-100">
                    <div className='p-5 mt-5'>
                        <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Additional Charges :</h6>
                                <div className='col-span-1'>
                                    <PlainInput
                                        id='additionalCharges'
                                        name='additionalCharges'
                                        type='text'
                                        placeholder='0'
                                        value={priceDetails.additionalCharges}
                                        onChange={handleAdditionalChange} />
                                </div>
                            </div>
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>GST :</h6>
                                <div className='col-span-1'>
                                    <PlainInput
                                        id='gst'
                                        name='gst'
                                        type='text'
                                        placeholder='0'
                                        value={priceDetails.gst}
                                        onChange={handleAdditionalGstChanges} />
                                </div>
                            </div>
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Add Discount :</h6>
                                <div className='col-span-1'>
                                    <PlainInput
                                        id='addDsicount'
                                        name='addDsicount'
                                        type='text'
                                        placeholder='0'
                                        value={priceDetails.addDiscount}
                                        onChange={handleDiscountChange} />
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Payment Type :</h6>
                                <div className='col-span-1'>
                                    <Selects
                                        id='paymentMethod'
                                        name='paymentMethod'
                                        value={priceDetails.paymentMethod}
                                        options={paymentTypeOptions}
                                        onChange={handlePaymentMethod}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="relative overflow-x-auto sm:rounded-lg mt-5 space-y-5">
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Paid :</h6>
                                <div className='col-span-1'>
                                    <PlainInput
                                        id='paid'
                                        name='paid'
                                        type='text'
                                        placeholder='0'
                                        value={priceDetails.paid}
                                        onChange={handlePaidChange} />
                                </div>
                            </div>
                            {/* <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Pending:</h6>
                                <div className='col-span-1'>
                                    <h1 className='text-xl text'>Rs :{priceDetails.pending ? priceDetails.pending : " 0"}</h1>
                                </div>
                            </div> */}
                            <div className='grid md:grid-cols-1 lg:grid-cols-5 justify-evenly items-center'>
                                <h6 className='col-span-4 lg:block hidden text-sm font-semibold'>Total Price :</h6>
                                <div className='col-span-1'>
                                    <h1 className='text-xl text'>Rs :{priceDetails.total ? priceDetails.total : " 0"}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* GIFT SECTION */}
                <div>
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
                    </div>
                </div>
                <div className='p-5 flex justify-end gap-2 items-center bg-[#fff] dark:bg-gray-900 dark:text-gray-100'>
                    <div className='flex gap-2'>
                        <OutlineButton title='Reset' type='button' />
                        <AddButton title='Add New' type='submit' />
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddInvoice
