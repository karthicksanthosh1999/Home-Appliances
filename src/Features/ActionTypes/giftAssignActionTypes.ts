
import axios, { AxiosError } from 'axios';
import { IGiftAssignment, IGiftAssignResponses } from '../../types/giftAssignTypes';
import * as giftAssignActions from '../Actions/giftAssignActions';
import { AppDispatch } from '../Store';
import { BASE_URI } from '../../App';
import toast from 'react-hot-toast';

export const fetchGiftAssignRequest = () => ({
    type: giftAssignActions.FETCH_GIFT_ASSIGN_REQUEST,
})

export const fetchGiftAssignSuccess = (gift: IGiftAssignResponses[]) => ({
    type: giftAssignActions.FETCH_GIFT_ASSIGN_SUCCESS,
    payload: gift
})

export const fetchGiftAssignFailure = (error: string) => ({
    type: giftAssignActions.FETCH_GIFT_ASSIGN_FAILURE,
    payload: error
})

export const fetchGiftAssignSingle = (gift: IGiftAssignResponses) => ({
    type: giftAssignActions.SINGLE_GIFT_ASSIGN_SUCCESS,
    payload: gift
})

export const createGiftAssignSuccess = (gift: IGiftAssignResponses) => ({
    type: giftAssignActions.CREATE_GIFT_ASSIGN_SUCCESS,
    payload: gift
})

export const deleteGiftAssignSuccess = (gift: IGiftAssignResponses) => ({
    type: giftAssignActions.DELETE_GIFT_ASSIGN_SUCCESS,
    payload: gift
})

export const updateGiftAssignSuccess = (gift: IGiftAssignResponses) => ({
    type: giftAssignActions.UPDATE_GIFT_ASSIGN_SUCCESS,
    payload: gift
})



// Thunk

// GET ALL GIFT THUNK
export const fetchAllGiftAssignThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftAssignRequest())
    try {
        const responses = await axios.get<{ responses: IGiftAssignResponses[], message: string }>(`${BASE_URI}/api/giftAssign/getAll-gifts-assign`, { withCredentials: true });
        dispatch(fetchGiftAssignSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchGiftAssignFailure(errorMessage))
    }
}

// CREATE GIFT THUNK
export const createGiftAssignThunk = (giftAssign: IGiftAssignment) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftAssignRequest())
    try {
        const res = await axios.post<{ responses: IGiftAssignResponses, error: string, message: string }>(`${BASE_URI}/api/giftAssign/create-gift-assign`, giftAssign, {
            withCredentials: true
        });
        dispatch(createGiftAssignSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data?.message
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else if (error) {
            errorMessage = String(error)
        }
        toast.error(errorMessage)
        dispatch(fetchGiftAssignFailure(errorMessage))
    }
}

// GET SINGLE GIFT THUNK
export const getSigleGiftAssingThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftAssignRequest())
    try {
        const res = await axios.get<{ responses: IGiftAssignResponses }>(`${BASE_URI}/api/giftAssign/getSingle-gift-assign/${id}`, { withCredentials: true });
        dispatch(fetchGiftAssignSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchGiftAssignFailure(errorMessage))
    }
}

// DELETE GIFT THUNK
export const deleteGiftAssignThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftAssignRequest())
    try {
        const res = await axios.delete<{ responses: IGiftAssignResponses, message: string }>(`${BASE_URI}/api/giftAssign/delete-gift-assign/${id}`, { withCredentials: true, });
        dispatch(deleteGiftAssignSuccess(res.data.responses))
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
        dispatch(fetchGiftAssignFailure(errorMessage))
    }
}

// UPDATE GIFT THUNK
export const updateGiftAssignThunk = (id: string, gift: IGiftAssignment) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftAssignRequest())
    try {
        const res = await axios.put<{ responses: IGiftAssignResponses }>(`${BASE_URI}/api/giftAssign/update-assign-gift/${id}`, gift, {
            withCredentials: true,
        });
        dispatch(updateGiftAssignSuccess(res.data.responses))
        console.log(res.data, gift)
        // toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchGiftAssignFailure(errorMessage))
    }
}