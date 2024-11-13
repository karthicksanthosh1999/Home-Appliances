import axios, { AxiosError } from 'axios';
import * as productActions from '../Actions/productActions';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { IProductInput, IProductResponse } from '../../types/productsTypes';
import { BASE_URI } from '../../App';

export const fetchProductRequest = () => ({
    type: productActions.FETCH_PRODUCT_REQUEST,
})

export const fetchProductSuccess = (product: IProductResponse[]) => ({
    type: productActions.FETCH_PRODUCT_SUCCESS,
    payload: product
})

export const fetchProductFailure = (error: string) => ({
    type: productActions.FETCH_PRODUCT_FAILURE,
    payload: error
})

export const fetchProductSingle = (product: IProductResponse) => ({
    type: productActions.SINGLE_PRODUCT_SUCCESS,
    payload: product
})

export const createProductSuccess = (product: IProductInput) => ({
    type: productActions.CREATE_PRODUCT_SUCCESS,
    payload: product
})

export const deleteProductSuccess = (product: IProductInput) => ({
    type: productActions.DELETE_PRODUCT_SUCCESS,
    payload: product
})

export const updateProductSuccess = (product: IProductInput) => ({
    type: productActions.UPDATE_PRODUCT_SUCCESS,
    payload: product
})

export const deleteMultipleProductSuccess = (product: string[]) => ({
    type: productActions.MULTIPLE_DELETE_PRODUCT_SUCCESS,
    payload: product
})

export const lowProductsSuccess = (product: IProductResponse[]) => ({
    type: productActions.LOW_PRODUCT_SUCCESS,
    payload: product
})


// Thunk

// GET ALL PRODUCT THUNK
export const fetchAllProductThunk = () => async (dispatch: AppDispatch) => {
    try {
        const responses = await axios.get<{ responses: IProductResponse[], message: string }>(`${BASE_URI}/api/product/getAll-products`, {
            withCredentials: true
        });
        dispatch(fetchProductSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchProductFailure(errorMessage))
    }
}

// CREATE PRODUCT THUNK
export const createProductThunk = (product: IProductInput) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest())
    try {
        const res = await axios.post<{ responses: IProductInput, error: string, message: string }>(`${BASE_URI}/api/product/create-product`, product, {
            withCredentials: true
        });
        dispatch(createProductSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data?.error
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else if (error) {
            errorMessage = String(error)
        }
        toast.error(errorMessage)
        dispatch(fetchProductFailure(errorMessage))
    }
}

// GET SINGLE PRODUCT THUNK
export const getSigleProductThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest())
    try {
        const res = await axios.get<{ responses: IProductResponse }>(`${BASE_URI}/api/product/single-product/${id}`, { withCredentials: true });
        dispatch(fetchProductSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchProductFailure(errorMessage))
    }
}

// DELETE PRODUCT THUNK
export const deleteProductThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: IProductInput, message: string }>(`${BASE_URI}/api/product/delete-product/${id}`, {
            withCredentials: true
        });
        dispatch(deleteProductSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchProductFailure(errorMessage))
    }
}

// UPDATE PRODUCT THUNK
export const updateProductThunk = (id: string, product: IProductInput) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put<{ responses: IProductInput, message: string }>(`${BASE_URI}/api/product/update-product/${id}`, product);
        dispatch(updateProductSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchProductFailure(errorMessage))
    }
}

//Multiple Delete Product Thunk
export const multipleDeleteProductThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/product/multipleDelete-products`, { data: { ids }, withCredentials: true });
        toast.success(res.data.message)
        dispatch(deleteMultipleProductSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchProductFailure(errorMessage));
    }
}

// GET LOW PRODUCT THUNK
export const getLowProductsThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest())
    try {
        const responses = await axios.get<{ responses: IProductResponse[], message: string }>(`${BASE_URI}/api/product/low-products`, {
            withCredentials: true
        });
        dispatch(lowProductsSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchProductFailure(errorMessage))
    }
}
