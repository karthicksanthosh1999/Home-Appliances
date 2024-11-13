import axios, { AxiosError } from 'axios';
import * as customerActions from '../Actions/customerActions';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { ICustomerInput } from '../../Screens/Customers/Customers';
import { BASE_URI } from '../../App';
import { ICustomer, ICustomerResponses } from '../../types/customerTypes';

export const fetchCustomerRequest = () => ({
    type: customerActions.FETCH_CUSTOMER_REQUEST,
})

export const fetchCustomerSuccess = (customer: ICustomerResponses[]) => ({
    type: customerActions.FETCH_CUSTOMER_SUCCESS,
    payload: customer
})

export const fetchCustomerFailure = (error: string) => ({
    type: customerActions.FETCH_CUSTOMER_FAILURE,
    payload: error
})

export const fetchCustomerSingle = (customer: ICustomer) => ({
    type: customerActions.SINGLE_CUSTOMER_SUCCESS,
    payload: customer
})

export const createCustomerSuccess = (customer: ICustomerResponses) => ({
    type: customerActions.CREATE_CUSTOMER_SUCCESS,
    payload: customer
})

export const deleteCustomerSuccess = (customer: ICustomerResponses) => ({
    type: customerActions.DELETE_CUSTOMER_SUCCESS,
    payload: customer
})

export const updateCustomerSuccess = (customer: ICustomerResponses) => ({
    type: customerActions.UPDATE_CUSTOMER_SUCCESS,
    payload: customer
})

export const deleteMultipleCustomerSuccess = (customer: string[]) => ({
    type: customerActions.MULTIPLE_DELETE_CUSTOMER_SUCCESS,
    payload: customer
})


// Thunk

// GET ALL CUSTOMER THUNK
export const fetchAllCustomerThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomerRequest())
    try {
        const responses = await axios.get<{ responses: ICustomerResponses[], message: string }>(`${BASE_URI}/api/customer/getAll-customers`, { withCredentials: true });
        dispatch(fetchCustomerSuccess(responses.data.responses))
        toast.success(responses.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchCustomerFailure(errorMessage))
    }
}

// CREATE CUSTOMER THUNK
export const createCustomerThunk = (customer: ICustomerInput) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomerRequest())
    try {
        const res = await axios.post<{ responses: ICustomerResponses, error: string, message: string }>(`${BASE_URI}/api/customer/create-customer`, customer, {
            withCredentials: true
        });
        dispatch(createCustomerSuccess(res.data.responses))
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
        dispatch(fetchCustomerFailure(errorMessage))
    }
}

// GET SINGLE CUSTOMER THUNK
export const getSigleCustomerThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomerRequest())
    try {
        const res = await axios.get<{ responses: ICustomer }>(`${BASE_URI}/api/customer/single-customer/${id}`, { withCredentials: true });
        dispatch(fetchCustomerSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchCustomerFailure(errorMessage))
    }
}

// DELETE CUSTOMER THUNK
export const deleteCustomerThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        console.log(id)
        const res = await axios.delete<{ responses: ICustomerResponses, message: string }>(`${BASE_URI}/api/customer/delete-customer/${id}`, { withCredentials: true });
        dispatch(deleteCustomerSuccess(res.data.responses))
        console.log(res.data.responses)
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchCustomerFailure(errorMessage))
    }
}

// UPDATE CUSTOMER THUNK
export const updateCustomerThunk = (id: string, customer: ICustomerInput) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put<{ responses: ICustomerResponses }>(`${BASE_URI}/api/customer/update-customer/${id}`, customer, { withCredentials: true });
        dispatch(updateCustomerSuccess(res.data.responses))
        console.log(res.data, customer)
        // toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchCustomerFailure(errorMessage))
    }
}

//Multiple Delete Customer Thunk
export const multipleDeleteCustomerThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/customer/multipleDelete-customers`, { data: { ids }, withCredentials: true });
        toast.success(res.data.message)
        dispatch(deleteMultipleCustomerSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchCustomerFailure(errorMessage));
    }
}

