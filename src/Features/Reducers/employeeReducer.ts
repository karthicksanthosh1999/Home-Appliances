import * as employeeActions from '../Actions/employeeActions';
import { IBranch } from './branchReducer';

export interface IEmployee {
    _id?: string,
    employeeName: string,
    employeeId: string,
    branch: IBranch,
    mobile: string,
    email: string,
    address: string,
    dob: Date,
    doj: Date,
    salary: number,
    idProof: string,
}

export interface IEmployeeResponse {
    _id?: string,
    employeeName: string,
    employeeId: string,
    branch: IBranch,
    mobile: string,
    email: string,
    address: string,
    dob: Date,
    doj: Date,
    salary: number,
    idProof: string,
}

interface IEmployeeState {
    employeeLoading: boolean,
    employees: IEmployee[],
    error: string | null
}

const initalState: IEmployeeState = {
    employeeLoading: false,
    employees: [],
    error: null
}

type employeesActions =
    | { type: typeof employeeActions.FETCH_EMPLOYEE_REQUEST }
    | { type: typeof employeeActions.FETCH_EMPLOYEE_FAILURE, payload: string }
    | { type: typeof employeeActions.FETCH_EMPLOYEE_SUCCESS, payload: IEmployee[] }
    | { type: typeof employeeActions.SINGLE_EMPLOYEE_SUCCESS, payload: IEmployee }
    | { type: typeof employeeActions.CREATE_EMPLOYEE_SUCCESS, payload: IEmployee }
    | { type: typeof employeeActions.DELETE_EMPLOYEE_SUCCESS, payload: IEmployee }
    | { type: typeof employeeActions.UPDATE_EMPLOYEE_SUCCESS, payload: IEmployee }
    | { type: typeof employeeActions.MULTIPLE_DELETE_EMPLOYEE_SUCCESS, payload: IEmployee[] }


const employeeReducer = (state: IEmployeeState = initalState, action: employeesActions): IEmployeeState => {
    switch (action.type) {
        case employeeActions.FETCH_EMPLOYEE_REQUEST:
            return {
                ...state,
                employeeLoading: true
            }
        case employeeActions.FETCH_EMPLOYEE_FAILURE:
            return {
                ...state,
                employeeLoading: false,
                error: action.payload
            }
        case employeeActions.FETCH_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeLoading: false,
                employees: action.payload
            }
        case employeeActions.CREATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeLoading: false,
                employees: [...state.employees, action.payload]
            }
        case employeeActions.DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeLoading: false,
                employees: state.employees.filter(item => item._id !== action.payload._id)
            }
        case employeeActions.SINGLE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeLoading: false,
                employees: state.employees.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case employeeActions.UPDATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeLoading: false,
                employees: state.employees.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case employeeActions.MULTIPLE_DELETE_EMPLOYEE_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedEmployee = action.payload.map((item) => item?._id)
                return {
                    ...state,
                    employees: state.employees.filter((item) => !deletedEmployee.includes(item._id))
                };
            }
            return state;
        default: {
            return state
        }
    }
}

export default employeeReducer;