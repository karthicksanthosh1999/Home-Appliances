import axios, { AxiosError } from 'axios';
import * as useractions from '../Actions/userActions';
import { IUser } from '../Reducers/userReducer';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { IUserInput } from '../../Screens/User/User';
import { BASE_URI } from '../../App';

export const fetchUserRequest = () => ({
    type: useractions.FETCH_USER_REQUEST
})

export const decodeUserSuccess = (user: IUser) => ({
    type: useractions.DECODE_USER_SUCCESS,
    payload: user
})
export const fetchUserSuccess = (user: IUser[]) => {
    return {
        type: useractions.FETCH_USER_SUCCESS,
        payload: user
    }
}

export const fetchUserFailure = (error: string) => ({
    type: useractions.FETCH_USER_FAILURE,
    payload: error
})


export const fetchUserSingle = (user: IUser) => ({
    type: useractions.SINGLE_USER_SUCCESS,
    payload: user
})

export const createUserSuccess = (user: IUser) => ({
    type: useractions.CREATE_USER_SUCCESS,
    payload: user
})

export const deleteUserSuccess = (user: IUser) => ({
    type: useractions.DELETE_USER_SUCCESS,
    payload: user
})

export const updateUserSuccess = (user: IUser) => ({
    type: useractions.UPDATE_USER_SUCCESS,
    payload: user
})

export const deleteMultipleUserSuccess = (user: string[]) => ({
    type: useractions.MULTIPLE_DELETE_USER_SUCCESS,
    payload: user
})

// Thunk
// CREATE CUSTOMER THUNK
export const createUserThunk = (user: IUserInput) => async (dispatch: AppDispatch) => {
    dispatch(fetchUserRequest())
    try {
        const res = await axios.post<{ responses: IUser, error: string, message: string }>(`${BASE_URI}/api/users/create-user`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(createUserSuccess(res.data.responses))
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
        dispatch(fetchUserFailure(errorMessage))
    }
}
// GET ALL USER THUNK
export const fetchAllUserThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchUserRequest())
    try {
        const responses = await axios.get<{ responses: IUser[], message: string }>(`${BASE_URI}/api/users/getAll-users`, {
            withCredentials: true
        });
        dispatch(fetchUserSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchUserFailure(errorMessage))
    }
}

// GET SINGLE USER THUNK
export const getSigleUserThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchUserRequest())
    try {
        const res = await axios.get<{ responses: IUser }>(`${BASE_URI}/api/users/single-user/${id}`, {
            withCredentials: true
        });
        dispatch(fetchUserSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchUserFailure(errorMessage))
    }
}

// DELETE USER THUNK
export const deleteUserThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: IUser, message: string }>(`${BASE_URI}/api/users/delete-user/${id}`, { withCredentials: true });
        dispatch(deleteUserSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        toast.error(errorMessage)
        dispatch(fetchUserFailure(errorMessage))
    }
}

// UPDATE USER THUNK
export const updateUserThunk = (id: string, user: IUserInput) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put<{ responses: IUser }>(`${BASE_URI}/api/users/update-user/${id}`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(updateUserSuccess(res.data.responses))
        console.log(res.data, user)
        // toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchUserFailure(errorMessage))
    }
}

//Multiple Delete User Thunk
export const multipleDeleteUserThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/users/multipleDelete-users`, { data: { ids }, withCredentials: true });
        toast.success(res.data.message)
        dispatch(deleteMultipleUserSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchUserFailure(errorMessage));
    }
}