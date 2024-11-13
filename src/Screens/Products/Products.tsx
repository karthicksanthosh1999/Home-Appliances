import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import OutlineButton from '../../Components/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import CancelButton from '../../Components/Buttons/CancelButton'
import PlainInput from '../../Components/Inputs/PlainInput'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, Rootstate } from '../../Features/Store'
import { createProductThunk, deleteProductThunk, fetchProductSuccess, multipleDeleteProductThunk, updateProductThunk } from '../../Features/ActionTypes/productActionTypes'
import TableLoading from '../../Components/Loading/TableLoading'
import { formatDateToYYYYMMDD } from '../../utilities/help'
import Selects from '../../Components/Inputs/Selects'
import axios from 'axios'
import SearchInput from '../../Components/Inputs/SearchInput'
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes'
import { IProductInput } from '../../types/productsTypes'
import { BASE_URI } from '../../App'



const Products: FC = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { productLoading, productResonse } = useSelector((state: Rootstate) => state.product)
    const { branches } = useSelector((state: Rootstate) => state.branch)
    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setisUpdateModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>('')
    const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>([])
    const [page, setPage] = useState<number>(1);
    const [limit, _setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [values, setValues] = useState<IProductInput>({
        brand: "",
        category: "",
        count: "",
        dealerName: "",
        mrp: "",
        productName: "",
    })
    const [errors, setErrors] = useState<Partial<IProductInput>>({})

    const openDeleteModal = (id: string) => {
        setSelectedProductId(id)
        setIsDeleteModalOpen(true)

    }
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setSelectedProductId(null)
    }
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        formRest();
    }
    const openUpdateModal = async (id: string) => {
        setisUpdateModalOpen(true)
        setSelectedProductId(id)
        await axios.get(`${BASE_URI}/api/product/single-product/${id}`, {
            withCredentials: true
        }).then(res => {
            const reponse = res.data.responses
            setValues((preV) => ({
                ...preV,
                productName: reponse.productName,
                brand: reponse.brand,
                branch: reponse.branch,
                category: reponse.category,
                count: reponse.count,
                dealerName: reponse.dealerName,
                mrp: reponse.mrp
            }))
        })
    }
    const closeUpdateModal = () => {
        setisUpdateModalOpen(false)
        setSelectedProductId(null)
        formRest()
    }

    useEffect(() => {
        axios.get(`${BASE_URI}/api/product/search-products?search=${searchTerm}&page=${page}&limit=${limit}`, {
            withCredentials: true
        }).then((res) => {
            const { pagination, products } = res.data.responses;
            dispatch(fetchProductSuccess(products))
            setTotalPages(pagination.totalPages)
        })
        dispatch(fetchAllBranchThunk())
    }, [dispatch, searchTerm, limit, page])

    const formRest = () => {
        setValues({
            brand: "",
            category: "",
            count: "",
            dealerName: "",
            mrp: "",
            productName: "",
        })
    }

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { value, name } = event.target;
        setValues((preV) => ({
            ...preV, [name]: value
        }))
    }

    const handleFocouse: FocusEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name } = event.target;
        setErrors((preV) => ({
            ...preV, [name]: ""
        }))
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            dispatch(createProductThunk(values))
            closeCreateModal()
        }
    }

    const handleValidation = (): Boolean => {
        const newError: Partial<IProductInput> = {};
        if (!values.productName) {
            newError.productName = "Product name is required!"
        }
        if (!values.brand) {
            newError.brand = "Brand is required!"
        }
        if (!values.mrp) {
            newError.mrp = "Mrp is required!"
        }
        if (!values.category) {
            newError.category = "Category is required!"
        }
        if (!values.dealerName) {
            newError.dealerName = "Dealer name is required!"
        }
        if (!values.count) {
            newError.count = "Count is required!"
        }

        setErrors(newError);

        return Object.keys(newError).length === 0;
    }

    const handleDelete = () => {
        if (selectedProductId) {
            dispatch(deleteProductThunk(selectedProductId))
            setSelectedProductId(null)
            closeDeleteModal()
        }
    }

    const handleUpdate = () => {
        if (selectedProductId) {
            dispatch(updateProductThunk(selectedProductId, values))
            formRest()
            closeUpdateModal()
        }
    }

    const handleCheckSingleCheckBox = (productId: string) => {
        setSelectedProductsIds((preSelectedIds) =>
            preSelectedIds.includes(productId)
                ? preSelectedIds.filter(id => id !== productId)
                : [...preSelectedIds, productId]
        )
    }

    const handleSelectedAllCheckbox = (isChecked: boolean) => {
        if (isChecked) {
            const allProductIds = (productResonse ?? []).map(item => item._id).filter((id): id is string => id !== undefined)
            setSelectedProductsIds(allProductIds)
        } else {
            setSelectedProductsIds([])
        }
    }

    const isAllSelected = (productResonse ?? []).length > 0 && selectedProductsIds.length === (productResonse ?? []).length;

    const handleMultipleDelete = () => {
        dispatch(multipleDeleteProductThunk(selectedProductsIds))
    };
    return (
        <>
            <div className='bg-white dark:bg-gray-900 mt-5 '>
                <div className='p-5 flex justify-between gap-2 items-center '>
                    <div>
                        <h1 className='text-2xl font-semibold leading-6 tracking-wide dark:text-gray-100 text-gray-900 '>Products</h1>
                    </div>
                    <div className='flex gap-2'>
                        <SearchInput placeholder='Search Branch Name' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {
                            selectedProductsIds &&

                                selectedProductsIds.length === 0 ? (
                                <div></div>
                            ) : (
                                <OutlineButton title='Delete' type='button' onclick={handleMultipleDelete} />
                            )
                        }
                        <OutlineButton title='Add New' type='button' onclick={openCreateModal} />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            checked={isAllSelected}
                                            onChange={(event) => handleSelectedAllCheckbox(event.target.checked)}
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Product Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Product ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Brand
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Branch
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Dealer Name
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    MRP
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Count
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    Status
                                </th> */}
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                            {
                                productLoading ? (
                                    <tr>
                                        <td colSpan={10} className='text-center py-10'>
                                            <TableLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    productResonse && productResonse.length === 0 ? (
                                        <tr className=''>
                                            <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                                        </tr>
                                    ) : (
                                        productResonse && productResonse.map((item, i) => (
                                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            checked={selectedProductsIds?.includes(item._id!)}
                                                            onChange={() => handleCheckSingleCheckBox(item._id!)}
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
                                                    {formatDateToYYYYMMDD(item.date) ? formatDateToYYYYMMDD(item.date) : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.productName ? item.productName : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.productId ? item.productId : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item?.brand ? item?.brand : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item?.branch?.branchName ? item?.branch?.branchName : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.category ? item.category : '-'}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {item.dealerName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    ${item.mrp}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.count}
                                                </td>
                                                <td className="px-6 py-4 flex gap-5">
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-orange-500 hover:text-orange-500">
                                                        <FontAwesomeIcon fontSize={15} icon={faPencil} onClick={() => openUpdateModal(item._id!)} /></a>
                                                    <a href="#" className="font-medium text-black dark:text-gray-400 dark:hover:text-orange-500 hover:text-orange-500">
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
                    <OutlineButton disabled={page === 1} title='Previous' type='button' onclick={() => setPage(page - 1)} />
                    <div>
                        <h3 className='dark:text-gray-400'>Page {page} of {totalPages}</h3>
                    </div>
                    <OutlineButton title='Next' type='button' disabled={page === totalPages} onclick={() => setPage(page + 1)} />
                </div>
            </div>

            <div>
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
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide leading-6 ">
                                        Delete Product
                                    </h3>
                                    <CancelButton onClick={closeDeleteModal} title={'close button'} type={'button'} />
                                </div>
                                <div className='p-5'>
                                    <h1 className='text-xl text-gray-900 dark:text-gray-400'>Are you sure, You want to delete this product?</h1>
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
                                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow dark:text-gray-400 text-gray-900" >
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Create Products
                                        </h3>
                                        <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Product Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='productName' name='productName' value={values.productName} type='text' placeholder='Product Name' />
                                                    {errors.productName && <span className='text-xs text-red-500 inline-block'>{errors.productName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Brand :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='brand' name='brand' value={values.brand} type='text' placeholder='Brand' />
                                                    {errors.brand && <span className='text-xs text-red-500 inline-block'>{errors.brand}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch?._id} onChange={handleChange} onFocus={handleFocouse} name='branch' options={options} />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Category :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='category' name='category' value={values.category} type='text' placeholder='Category' />
                                                    {errors.category && <span className='text-xs text-red-500 inline-block'>{errors.category}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Dealer Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='dealerName' name='dealerName' value={values.dealerName} type='text' placeholder='Dealer Name' />
                                                    {errors.dealerName && <span className='text-xs text-red-500 inline-block'>{errors.dealerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>MRP :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='mrp' name='mrp' type='number' value={values.mrp} placeholder='MRP' />
                                                    {errors.mrp && <span className='text-xs text-red-500 inline-block'>{errors.mrp}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Quantity :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='count' name='count' type='number' value={values.count} placeholder='count' />
                                                    {errors.count && <span className='text-xs text-red-500 inline-block'>{errors.count}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeCreateModal} />
                                        <OutlineButton type='submit' title='Add Product' />
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
                                            Update Products
                                        </h3>
                                        <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                                    </div>
                                    <div className='p-5'>
                                        <div className='space-y-3 text-gray-900 dark:text-gray-400'>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Product Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='productName' name='productName' value={values.productName} type='text' placeholder='Product Name' />
                                                    {errors.productName && <span className='text-xs text-red-500 inline-block'>{errors.productName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Brand :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='brand' name='brand' value={values.brand} type='text' placeholder='Brand' />
                                                    {errors.brand && <span className='text-xs text-red-500 inline-block'>{errors.brand}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Branch :</h6>
                                                <div className='col-span-3'>
                                                    <Selects id='branch' value={values.branch?._id} onChange={handleChange} onFocus={handleFocouse} name='branch' options={options} />
                                                    {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch?._id}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Category :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='category' name='category' value={values.category} type='text' placeholder='Category' />
                                                    {errors.category && <span className='text-xs text-red-500 inline-block'>{errors.category}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Dealer Name :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='dealerName' name='dealerName' value={values.dealerName} type='text' placeholder='Dealer Name' />
                                                    {errors.dealerName && <span className='text-xs text-red-500 inline-block'>{errors.dealerName}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>MRP :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='mrp' name='mrp' type='number' value={values.mrp} placeholder='MRP' />
                                                    {errors.mrp && <span className='text-xs text-red-500 inline-block'>{errors.mrp}</span>}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-5 justify-evenly items-center'>
                                                <h6 className='col-span-2 text-base font-semibold'>Cound :</h6>
                                                <div className='col-span-3'>
                                                    <PlainInput onChange={handleChange} onForcus={handleFocouse} id='count' name='count' type='number' value={values.count} placeholder='count' />
                                                    {errors.count && <span className='text-xs text-red-500 inline-block'>{errors.count}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                                        <OutlineButton type='reset' title='Cancel' onclick={closeUpdateModal} />
                                        <OutlineButton type='submit' title='Update' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}

export default Products
