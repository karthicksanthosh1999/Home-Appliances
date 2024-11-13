import axios, { AxiosError } from 'axios';
import * as leadActions from '../Actions/leadActions';
import { ILead } from '../Reducers/leadReducer';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { BASE_URI } from '../../App';

export const fetchLeadRequest = () => ({
    type: leadActions.FETCH_LEAD_REQUEST,
})

export const fetchLeadSuccess = (lead: ILead[]) => ({
    type: leadActions.FETCH_LEAD_SUCCESS,
    payload: lead
})

export const fetchLeadFailure = (error: string) => ({
    type: leadActions.FETCH_LEAD_FAILURE,
    payload: error
})

export const fetchLeadSingle = (lead: ILead) => ({
    type: leadActions.SINGLE_LEAD_SUCCESS,
    payload: lead
})

export const createLeadSuccess = (lead: ILead) => ({
    type: leadActions.CREATE_LEAD_SUCCESS,
    payload: lead
})

export const deleteLeadSuccess = (lead: ILead) => ({
    type: leadActions.DELETE_LEAD_SUCCESS,
    payload: lead
})

export const updateLeadSuccess = (lead: ILead) => ({
    type: leadActions.UPDATE_LEAD_SUCCESS,
    payload: lead
})

export const deleteMultipleLeadSuccess = (lead: string[]) => ({
    type: leadActions.MULTIPLE_DELETE_LEAD_SUCCESS,
    payload: lead
})

export const bulkLeadSuccess = (lead: ILead[]) => ({
    type: leadActions.BULK_LEAD_SUCCESS,
    payload: lead
})

export const todayLeadListSuccess = (lead: ILead[]) => ({
    type: leadActions.TODAYS_LEADS_SUCCESS,
    payload: lead
})


// Thunk

// GET ALL LEAD THUNK
export const fetchAllLeadThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchLeadRequest())
    try {
        const responses = await axios.get<{ responses: ILead[], message: string }>(`${BASE_URI}/api/lead/getAll-leads`, {
            withCredentials: true
        });
        dispatch(fetchLeadSuccess(responses.data.responses))
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
        dispatch(fetchLeadFailure(errorMessage))
    }
}

// CREATE LEAD THUNK
export const createLeadThunk = (lead: ILead) => async (dispatch: AppDispatch) => {
    dispatch(fetchLeadRequest())
    try {
        const res = await axios.post<{ responses: ILead, error: string, message: string }>(`${BASE_URI}/api/lead/create-lead`, lead, {
            withCredentials: true
        });
        dispatch(createLeadSuccess(res.data.responses))
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
        dispatch(fetchLeadFailure(errorMessage))
    }
}

// GET SINGLE LEAD THUNK
export const getSigleLeadThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchLeadRequest())
    try {
        const res = await axios.get<{ responses: ILead }>(`${BASE_URI}/api/lead/single-lead/${id}`, {
            withCredentials: true
        });
        dispatch(fetchLeadSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchLeadFailure(errorMessage))
    }
}

// DELETE LEAD THUNK
export const deleteLeadThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: ILead, message: string }>(`${BASE_URI}/api/lead/delete-lead/${id}`, {
            withCredentials: true
        });
        dispatch(deleteLeadSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchLeadFailure(errorMessage))
    }
}

// UPDATE LEAD THUNK
export const updateLeadThunk = (id: string, lead: ILead) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put<{ responses: ILead, message: string }>(`${BASE_URI}/api/lead/update-lead/${id}`, lead, { withCredentials: true });
        dispatch(updateLeadSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchLeadFailure(errorMessage))
    }
}

//Multiple Delete Lead Thunk
export const multipleDeleteLeadThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/lead/multipleDelete-leads`, { data: { ids }, withCredentials: true });
        toast.success(res.data.message)
        dispatch(deleteMultipleLeadSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchLeadFailure(errorMessage));
    }
}

//Bulk Upload Lead Thunk
export const bulkUploadLeadThunk = (lead: ILead[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post<{ message: string, responses: ILead[] }>(`${BASE_URI}/api/lead/bulk-leads`, { leads: lead }, {
            withCredentials: true
        })
        toast.success(res.data.message)
        dispatch(bulkLeadSuccess(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchLeadFailure(errorMessage))
    }
}

//Today Lead List Thunk
export const todayLeadListThunk = (today: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get<{ today: string, responses: ILead[] }>(`${BASE_URI}/api/lead/today-leads?today=${today}`, {
            withCredentials: true
        })
        dispatch(todayLeadListSuccess(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchLeadFailure(errorMessage))
    }
}