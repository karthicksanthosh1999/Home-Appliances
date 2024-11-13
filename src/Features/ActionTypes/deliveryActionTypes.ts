import axios, { AxiosError } from 'axios';
import * as deliveryhActions from '../Actions/deliveryActions';
import { AppDispatch } from '../Store';
import { TDelivery, TDeliveryResponse } from '../../types/deliveryTypes';
import { BASE_URI } from '../../App';
import toast from 'react-hot-toast';

export const fetchDeliveryRequest = () => ({
    type: deliveryhActions.FETCH_DELIVERY_REQUEST,
})

export const fetchDeliverySuccess = (delivery: TDeliveryResponse[]) => ({
    type: deliveryhActions.FETCH_DELIVERY_SUCCESS,
    payload: delivery
})

export const fetchDeliveryFailure = (error: string) => ({
    type: deliveryhActions.FETCH_DELIVERY_FAILURE,
    payload: error
})

export const fetchDeliverySingle = (delivery: TDeliveryResponse) => ({
    type: deliveryhActions.SINGLE_DELIVERY_SUCCESS,
    payload: delivery
})

export const createDeliverySuccess = (delivery: TDelivery) => ({
    type: deliveryhActions.CREATE_DELIVERY_SUCCESS,
    payload: delivery
})

export const deleteDeliverySuccess = (delivery: TDeliveryResponse) => ({
    type: deliveryhActions.DELETE_DELIVERY_SUCCESS,
    payload: delivery
})

export const updateDeliverySuccess = (delivery: TDeliveryResponse) => ({
    type: deliveryhActions.UPDATE_DELIVERY_SUCCESS,
    payload: delivery
})

// export const deleteMultipleDeliverySuccess = (delivery: TDelivery[]) => ({
//     type: deliveryhActions.MULTIPLE_DELIVERY_SUCCESS,
//     payload: delivery
// })


// Thunk

// GET ALL delivery THUNK
export const fetchAllDeliveryThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchDeliveryRequest())
    try {
        const responses = await axios.get<{ responses: TDeliveryResponse[] }>(`${BASE_URI}/api/delivery/getAll-delivery`, { withCredentials: true });
        dispatch(fetchDeliverySuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchDeliveryFailure(errorMessage))
    }
}

// CREATE delivery THUNK
export const createDeliveryThunk = (delivery: FormData) => async (dispatch: AppDispatch) => {
    dispatch(fetchDeliveryRequest())
    try {
        const res = await axios.post<{ responses: TDelivery, message: string }>(`${BASE_URI}/api/delivery/create-delivery`, delivery, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(createDeliverySuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchDeliveryFailure(errorMessage))
    }
}

// GET SINGLE delivery THUNK
export const getSigleDeliveryThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get<{ responses: TDeliveryResponse }>(`${BASE_URI}/api/delivery/single-delivery/${id}`, {
            withCredentials: true
        });
        console.log(res.data.responses)
        dispatch(fetchDeliverySingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchDeliveryFailure(errorMessage))
    }
}

// DELETE delivery THUNK
export const deleteDeliveryThunk = (id: string) => async (dispatch: AppDispatch) => {
    fetchDeliveryRequest()
    try {
        const res = await axios.delete<{ responses: TDeliveryResponse, message: string }>(`${BASE_URI}/api/delivery/delete-delivery/${id}`, {
            withCredentials: true
        });
        console.log(res.data.responses)
        dispatch(deleteDeliverySuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchDeliveryFailure(errorMessage))
    }
}

// UPDATE delivery THUNK
export const updateDeliveryThunk = (id: string, delivery: FormData) => async (dispatch: AppDispatch) => {
    fetchDeliveryRequest()
    try {
        const res = await axios.put<{ responses: TDeliveryResponse, message: string }>(`${BASE_URI}/api/delivery/update-delivery/${id}`, delivery, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch(updateDeliverySuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchDeliveryFailure(errorMessage))
    }
}

//Multiple Delete delivery Thunk
// export const multipleDeleteDeliveryThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
//     try {
//         const res = await axios.delete<{ responses: TDelivery[] }>(`${BASE_URI}/api/delivery/multipleDelete-branches`, ids);
//         console.log(res.data.responses)
//         dispatch(deleteMultipleDeliverySuccess(res.data.responses));
//     } catch (error: unknown) {
//         let errorMessage = 'Unknown error occurred';
//         if (error instanceof AxiosError && error.response) {
//             errorMessage = error.response?.data;
//         } else if (error instanceof Error) {
//             errorMessage = error.message;
//         }
//         dispatch(fetchDeliveryFailure(errorMessage));
//     }
// }