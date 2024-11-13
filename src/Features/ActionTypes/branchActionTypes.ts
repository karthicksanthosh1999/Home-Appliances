import axios, { AxiosError } from 'axios';
import * as branchActions from '../Actions/branchActions';
import { IBranch } from '../Reducers/branchReducer';
import { AppDispatch } from '../Store';
import { BASE_URI } from '../../App';
import toast from 'react-hot-toast';

export const fetchBranchRequest = () => ({
    type: branchActions.FETCH_BRANCH_REQUEST,
})

export const fetchBranchSuccess = (branch: IBranch[]) => ({
    type: branchActions.FETCH_BRANCH_SUCCESS,
    payload: branch
})

export const fetchBranchFailure = (error: string) => ({
    type: branchActions.FETCH_BRANCH_FAILURE,
    payload: error
})

export const fetchBranchSingle = (branch: IBranch) => ({
    type: branchActions.SINGLE_BRANCH_SUCCESS,
    payload: branch
})

export const createBranchSuccess = (branch: IBranch) => ({
    type: branchActions.CREATE_BRANCH_SUCCESS,
    payload: branch
})

export const deleteBranchSuccess = (branch: IBranch) => ({
    type: branchActions.DELETE_BRANCH_SUCCESS,
    payload: branch
})

export const updateBranchSuccess = (branch: IBranch) => ({
    type: branchActions.UPDATE_BRANCH_SUCCESS,
    payload: branch
})

export const deleteMultipleBranchSuccess = (branch: IBranch[]) => ({
    type: branchActions.MULTIPLE_BRANCH_SUCCESS,
    payload: branch
})


// Thunk

// GET ALL BRANCH THUNK
export const fetchAllBranchThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchBranchRequest())
    try {
        const responses = await axios.get<{ responses: IBranch[] }>(`${BASE_URI}/api/branch/getAll-branches`, { withCredentials: true });
        dispatch(fetchBranchSuccess(responses.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchBranchFailure(errorMessage))
    }
}

// CREATE BRANCH THUNK
export const createBranchThunk = (branch: IBranch) => async (dispatch: AppDispatch) => {
    dispatch(fetchBranchRequest())
    try {
        const res = await axios.post<{ responses: IBranch, message: string }>(`${BASE_URI}/api/branch/create-branch`, branch, {
            withCredentials: true
        });
        dispatch(createBranchSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchBranchFailure(errorMessage))
    }
}

// GET SINGLE BRANCH THUNK
export const getSigleBranchThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchBranchRequest())
    try {
        const res = await axios.get<{ responses: IBranch }>(`${BASE_URI}/api/branch/single-branch/${id}`, {
            withCredentials: true
        });
        dispatch(fetchBranchSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchBranchFailure(errorMessage))
    }
}

// DELETE BRANCH THUNK
export const deleteBranchThunk = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: IBranch }>(`${BASE_URI}/api/branch/delete-branch/${id}`, { withCredentials: true });
        dispatch(deleteBranchSuccess(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchBranchFailure(errorMessage))
    }
}

// UPDATE BRANCH THUNK
export const updateBranchThunk = (id: string, branch: IBranch) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put<{ responses: IBranch, message: string }>(`${BASE_URI}/api/branch/update-branch/${id}`, branch, { withCredentials: true });
        dispatch(updateBranchSuccess(res.data.responses))
        toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchBranchFailure(errorMessage))
    }
}

//Multiple Delete Branch Thunk
export const multipleDeleteBranchThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: IBranch[] }>(`${BASE_URI}/api/branch/multipleDelete-branches`, { data: { ids }, withCredentials: true });
        dispatch(deleteMultipleBranchSuccess(res.data.responses));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchBranchFailure(errorMessage));
    }
}