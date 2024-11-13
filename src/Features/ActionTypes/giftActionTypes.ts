import axios, { AxiosError } from 'axios';
import * as giftActions from '../Actions/giftActions';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { BASE_URI } from '../../App';
import { IGift, IGiftResponse } from '../../types/giftTypes';

export const fetchGiftRequest = () => ({
    type: giftActions.FETCH_GIFT_REQUEST,
})

export const fetchGiftSuccess = (gift: IGiftResponse[]) => ({
    type: giftActions.FETCH_GIFT_SUCCESS,
    payload: gift
})

export const fetchGiftFailure = (error: string) => ({
    type: giftActions.FETCH_GIFT_FAILURE,
    payload: error
})

export const fetchGiftSingle = (gift: IGiftResponse) => ({
    type: giftActions.SINGLE_GIFT_SUCCESS,
    payload: gift
})

export const createGiftSuccess = (gift: IGiftResponse) => ({
    type: giftActions.CREATE_GIFT_SUCCESS,
    payload: gift
})

export const deleteGiftSuccess = (gift: IGiftResponse) => ({
    type: giftActions.DELETE_GIFT_SUCCESS,
    payload: gift
})

export const updateGiftSuccess = (gift: IGiftResponse) => ({
    type: giftActions.UPDATE_GIFT_SUCCESS,
    payload: gift
})

export const deleteMultipleGiftSuccess = (gift: string[]) => ({
    type: giftActions.MULTIPLE_DELETE_GIFT_SUCCESS,
    payload: gift
})


// Thunk

// GET ALL GIFT THUNK
export const fetchAllGiftThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftRequest())
    try {
        const responses = await axios.get<{ responses: IGiftResponse[], message: string }>(`${BASE_URI}/api/gift/getAll-gifts`, { withCredentials: true });
        dispatch(fetchGiftSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        console.log(errorMessage)
        toast.error(errorMessage)
        dispatch(fetchGiftFailure(errorMessage))
    }
}

// CREATE GIFT THUNK
export const createGiftThunk = (gift: IGift) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftRequest())
    try {
        const res = await axios.post<{ responses: IGiftResponse, error: string, message: string }>(`${BASE_URI}/api/gift/create-gift`, gift, {
            withCredentials: true
        });
        dispatch(createGiftSuccess(res.data.responses))
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
        dispatch(fetchGiftFailure(errorMessage))
    }
}

// GET SINGLE GIFT THUNK
export const getSigleGiftThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftRequest())
    try {
        const res = await axios.get<{ responses: IGiftResponse }>(`${BASE_URI}/api/gift/getSingle-gift/${id}`, { withCredentials: true });
        dispatch(fetchGiftSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchGiftFailure(errorMessage))
    }
}

// DELETE GIFT THUNK
export const deleteGiftThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftRequest())
    try {
        const res = await axios.delete<{ responses: IGiftResponse, message: string }>(`${BASE_URI}/api/gift/delete-gift/${id}`, { withCredentials: true, });
        dispatch(deleteGiftSuccess(res.data.responses))
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
        dispatch(fetchGiftFailure(errorMessage))
    }
}

// UPDATE GIFT THUNK
export const updateGiftThunk = (id: string, gift: IGift) => async (dispatch: AppDispatch) => {
    dispatch(fetchGiftRequest())
    try {
        const res = await axios.put<{ responses: IGiftResponse }>(`${BASE_URI}/api/gift/update-gift/${id}`, gift, {
            withCredentials: true,
        });
        dispatch(updateGiftSuccess(res.data.responses))
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
        dispatch(fetchGiftFailure(errorMessage))
    }
}

//Multiple Delete Gift Thunk
export const multipleDeleteGiftThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/gift/multipleDelete-employees`, { data: { ids } });
        toast.success(res.data.message)
        dispatch(deleteMultipleGiftSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchGiftFailure(errorMessage));
    }
}