import axios, { AxiosError } from 'axios';
import * as invoiceActions from '../Actions/invoiceActions';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { BASE_URI } from '../../App';
import { IInvoice, IInvoiceResponses } from '../../types/invoiceTypes';

export const fetchInvoiceRequest = () => ({
    type: invoiceActions.FETCH_INVOICE_REQUEST,
})

export const fetchInvoiceSuccess = (invoice: IInvoiceResponses[]) => ({
    type: invoiceActions.FETCH_INVOICE_SUCCESS,
    payload: invoice
})

export const fetchInvoiceFailure = (error: string) => ({
    type: invoiceActions.FETCH_INVOICE_FAILURE,
    payload: error
})

export const fetchInvoiceSingle = (invoice: IInvoice) => ({
    type: invoiceActions.SINGLE_INVOICE_SUCCESS,
    payload: invoice
})

export const createInvoiceSuccess = (invoice: IInvoiceResponses) => ({
    type: invoiceActions.CREATE_INVOICE_SUCCESS,
    payload: invoice
})

export const deleteInvoiceSuccess = (invoice: IInvoiceResponses) => ({
    type: invoiceActions.DELETE_INVOICE_SUCCESS,
    payload: invoice
})

export const updateInvoiceSuccess = (invoice: IInvoiceResponses) => ({
    type: invoiceActions.UPDATE_INVOICE_SUCCESS,
    payload: invoice
})

export const deleteMultipleInvoiceSuccess = (invoice: string[]) => ({
    type: invoiceActions.MULTIPLE_DELETE_INVOICE_SUCCESS,
    payload: invoice
})


// Thunk

// GET ALL INVOICE THUNK
export const fetchAllInvoiceThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const responses = await axios.get<{ responses: IInvoiceResponses[], message: string }>(`${BASE_URI}/api/invoice/getAll-invoices`, { withCredentials: true });
        dispatch(fetchInvoiceSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchInvoiceFailure(errorMessage))
    }
}

// CREATE INVOICE THUNK
export const createInvoiceThunk = (invoice: IInvoice) => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const res = await axios.post<{ responses: IInvoiceResponses, error: string, message: string }>(`${BASE_URI}/api/invoice/create-invoice`, invoice, {
            withCredentials: true
        });
        dispatch(createInvoiceSuccess(res.data.responses))
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
        dispatch(fetchInvoiceFailure(errorMessage))
    }
}

// GET SINGLE INVOICE THUNK
export const getSigleInvoiceThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const res = await axios.get<{ responses: IInvoice }>(`${BASE_URI}/api/invoice/single-invoice/${id}`, { withCredentials: true });
        dispatch(fetchInvoiceSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchInvoiceFailure(errorMessage))
    }
}

// DELETE INVOICE THUNK
export const deleteInvoiceThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const res = await axios.delete<{ responses: IInvoiceResponses, message: string }>(`${BASE_URI}/api/invoice/delete-invoice/${id}`, { withCredentials: true });
        dispatch(deleteInvoiceSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchInvoiceFailure(errorMessage))
    }
}

// UPDATE INVOICE THUNK
export const updateInvoiceThunk = (id: string, invoice: IInvoiceResponses) => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const res = await axios.put<{ responses: IInvoiceResponses, message: string }>(`${BASE_URI}/api/invoice/update-invoice/${id}`, invoice, {
            withCredentials: true
        });
        dispatch(updateInvoiceSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchInvoiceFailure(errorMessage))
    }
}

//Multiple Delete Invoice Thunk
export const multipleDeleteInvoiceThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    dispatch(fetchInvoiceRequest())
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/invoice/multipleDelete-invoice`, { data: { ids }, withCredentials: true });
        toast.success(res.data.message)
        dispatch(deleteMultipleInvoiceSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchInvoiceFailure(errorMessage));
    }
}