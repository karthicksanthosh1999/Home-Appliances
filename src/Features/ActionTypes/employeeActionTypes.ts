import axios, { AxiosError } from 'axios';
import * as employeeActions from '../Actions/employeeActions';
import { IEmployee, IEmployeeResponse } from '../Reducers/employeeReducer';
import { AppDispatch } from '../Store';
import toast from 'react-hot-toast';
import { IEmployeeInput } from '../../Screens/Employees/Employees';
import { BASE_URI } from '../../App';

export const fetchEmployeeRequest = () => ({
    type: employeeActions.FETCH_EMPLOYEE_REQUEST,
})

export const fetchEmployeeSuccess = (employee: IEmployeeResponse[]) => ({
    type: employeeActions.FETCH_EMPLOYEE_SUCCESS,
    payload: employee
})

export const fetchEmployeeFailure = (error: string) => ({
    type: employeeActions.FETCH_EMPLOYEE_FAILURE,
    payload: error
})

export const fetchEmployeeSingle = (employee: IEmployeeResponse) => ({
    type: employeeActions.SINGLE_EMPLOYEE_SUCCESS,
    payload: employee
})

export const createEmployeeSuccess = (employee: IEmployee) => ({
    type: employeeActions.CREATE_EMPLOYEE_SUCCESS,
    payload: employee
})

export const deleteEmployeeSuccess = (employee: IEmployee) => ({
    type: employeeActions.DELETE_EMPLOYEE_SUCCESS,
    payload: employee
})

export const updateEmployeeSuccess = (employee: IEmployee) => ({
    type: employeeActions.UPDATE_EMPLOYEE_SUCCESS,
    payload: employee
})

export const deleteMultipleEmployeeSuccess = (employee: string[]) => ({
    type: employeeActions.MULTIPLE_DELETE_EMPLOYEE_SUCCESS,
    payload: employee
})


// Thunk

// GET ALL EMPLOYEE THUNK
export const fetchAllEmployeeThunk = () => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeRequest())
    try {
        const responses = await axios.get<{ responses: IEmployee[], message: string }>(`${BASE_URI}/api/employee/getAll-employees`, { withCredentials: true });
        dispatch(fetchEmployeeSuccess(responses.data.responses))
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
        dispatch(fetchEmployeeFailure(errorMessage))
    }
}

// CREATE EMPLOYEE THUNK
export const createEmployeeThunk = (employee: IEmployeeInput) => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeRequest())
    try {
        const res = await axios.post<{ responses: IEmployee, error: string, message: string }>(`${BASE_URI}/api/employee/create-employee`, employee, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(createEmployeeSuccess(res.data.responses))
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
        dispatch(fetchEmployeeFailure(errorMessage))
    }
}

// GET SINGLE EMPLOYEE THUNK
export const getSigleEmployeeThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeRequest())
    try {
        const res = await axios.get<{ responses: IEmployee }>(`${BASE_URI}/api/employee/single-employee/${id}`, { withCredentials: true });
        dispatch(fetchEmployeeSingle(res.data.responses))
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        dispatch(fetchEmployeeFailure(errorMessage))
    }
}

// DELETE EMPLOYEE THUNK
export const deleteEmployeeThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeRequest())
    try {
        const res = await axios.delete<{ responses: IEmployee, message: string }>(`${BASE_URI}/api/employee/delete-employee/${id}`, { withCredentials: true, });
        dispatch(deleteEmployeeSuccess(res.data.responses))
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
        dispatch(fetchEmployeeFailure(errorMessage))
    }
}

// UPDATE EMPLOYEE THUNK
export const updateEmployeeThunk = (id: string, employee: IEmployeeInput) => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeRequest())
    try {
        const res = await axios.put<{ responses: IEmployee }>(`${BASE_URI}/api/employee/update-employee/${id}`, employee, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(updateEmployeeSuccess(res.data.responses))
        console.log(res.data, employee)
        // toast.success(res.data.message)
    } catch (error: unknown) {
        let errorMessage = 'Unknow error occurred';
        if (error instanceof AxiosError && error) {
            errorMessage = error.response?.data
        } else if (error instanceof Error) {
            errorMessage = error.message
        }
        // toast.error(errorMessage)
        dispatch(fetchEmployeeFailure(errorMessage))
    }
}

//Multiple Delete Employee Thunk
export const multipleDeleteEmployeeThunk = (ids: string[]) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete<{ responses: number, message: string }>(`${BASE_URI}/api/employee/multipleDelete-employees`, { data: { ids } });
        toast.success(res.data.message)
        dispatch(deleteMultipleEmployeeSuccess(ids));
    } catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response?.data;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch(fetchEmployeeFailure(errorMessage));
    }
}