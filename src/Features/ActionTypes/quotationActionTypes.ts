import axios, { AxiosError } from 'axios';
import * as QuotationActions from '../Actions/quotationActions';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { IQuotation, IQuotationResponse } from '../../types/quotationTypes';
import { BASE_URI } from '../../App';

export const fetchQuotationRequest = () => ({
    type: QuotationActions.FETCH_QUOTATION_REQUEST,
})

export const fetchQuotationSuccess = (quotation: IQuotationResponse[]) => ({
    type: QuotationActions.FETCH_QUOTATION_SUCCESS,
    payload: quotation
})

export const fetchQuotationFailure = (error: string) => ({
    type: QuotationActions.FETCH_QUOTATION_FAILURE,
    payload: error
})

export const fetchQuotationSingle = (quotation: IQuotationResponse) => ({
    type: QuotationActions.SINGLE_QUOTATION_SUCCESS,
    payload: quotation
})

export const createQuotationSuccess = (quotation: IQuotation) => ({
    type: QuotationActions.CREATE_QUOTATION_SUCCESS,
    payload: quotation
})

export const deleteQuotationSuccess = (quotation: IQuotation) => ({
    type: QuotationActions.DELETE_QUOTATION_SUCCESS,
    payload: quotation
})

export const updateQuotationSuccess = (quotation: IQuotation) => ({
    type: QuotationActions.UPDATE_QUOTATION_SUCCESS,
    payload: quotation
})

export const deleteMultipleQuotationSuccess = (quotation: string[]) => ({
    type: QuotationActions.MULTIPLE_DELETE_QUOTATION_SUCCESS,
    payload: quotation
})

export const statusChangeQuotationSuccess = (quotaion: IQuotation) => ({
    type: QuotationActions.CHANGE_STATUS_QUOTATION_SUCCESS,
    payload: quotaion
})

export const changeQuotationToInvoiceSuccess = (quotation: IQuotation) => ({
    type: QuotationActions.CHANGE_QUOTATION_TO_INVOICE_SUCCESS,
    payload: quotation
})


// Thunk

// GET ALL quotation THUNK
export const fetchAllQuotationThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const responses = await axios.get<{ responses: IQuotationResponse[], message: string }>(`${BASE_URI}/api/quotation/getAll-quotations`, {
            withCredentials: true
        });
        dispatch(fetchQuotationSuccess(responses.data.responses))
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
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

// CREATE quotation THUNK
export const createQuotationThunk = (quotation: IQuotation) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.post<{ responses: IQuotation, error: string, message: string }>(`${BASE_URI}/api/quotation/create-quotation`, quotation, {
            withCredentials: true
        });
        dispatch(createQuotationSuccess(res.data.responses))
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
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

// GET SINGLE quotation THUNK
export const getSigleQuotationThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.get<{ responses: IQuotationResponse }>(`${BASE_URI}/api/quotation/single-quotation/${id}`, {
            withCredentials: true
        });
        dispatch(fetchQuotationSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

// DELETE quotation THUNK
export const deleteQuotationThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.delete<{ responses: IQuotation, message: string }>(`${BASE_URI}/api/quotation/delete-quotation/${id}`, {
            withCredentials: true
        });
        dispatch(deleteQuotationSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

// UPDATE quotation THUNK
export const updateQuotationThunk = (id: string, quotation: IQuotation) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.put<{ responses: IQuotation, message: string }>(`${BASE_URI}/api/quotation/update-quotation/${id}`, quotation, {
            withCredentials: true
        });
        dispatch(updateQuotationSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

//Multiple Delete quotation Thunk
export const multipleDeleteQuotationThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/quotation/multipleDelete-quotations`, { data: { ids } });
        toast.success(res.data.message)
        dispatch(deleteMultipleQuotationSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchQuotationFailure(errorMessage));
    }
}

// Change Quotation Status Thunk
export const changeQuotationStatusThunk = (id: string, quotationStatus: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const data = {
            id,
            quotationStatus
        }
        const res = await axios.put<{ responses: IQuotation, message: string }>(`${BASE_URI}/api/quotation/update-quotation-status`, data, {
            withCredentials: true
        });
        dispatch(statusChangeQuotationSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchQuotationFailure(errorMessage))
    }
}

// Change Quotaion To Invoice Thunk
export const changeQuotaionToInvoiceThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchQuotationRequest())
    try {
        const res = await axios.post<{ responses: IQuotation, message: string }>(`${BASE_URI}/api/quotation/convet-quotation-status/${id}`);
        dispatch(changeQuotationToInvoiceSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchQuotationFailure(errorMessage))
    }
}