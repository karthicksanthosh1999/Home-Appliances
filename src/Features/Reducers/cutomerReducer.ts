import { ICustomer, ICustomerResponses, ICustomerState } from '../../types/customerTypes';
import * as customerActions from '../Actions/customerActions';

const initalState: ICustomerState = {
    customerLoading: false,
    customers: [],
    customersResponse: [],
    error: null
}

type customersActions =
    | { type: typeof customerActions.FETCH_CUSTOMER_REQUEST }
    | { type: typeof customerActions.FETCH_CUSTOMER_FAILURE, payload: string }
    | { type: typeof customerActions.FETCH_CUSTOMER_SUCCESS, payload: ICustomerResponses[] }
    | { type: typeof customerActions.SINGLE_CUSTOMER_SUCCESS, payload: ICustomer }
    | { type: typeof customerActions.CREATE_CUSTOMER_SUCCESS, payload: ICustomerResponses }
    | { type: typeof customerActions.DELETE_CUSTOMER_SUCCESS, payload: ICustomerResponses }
    | { type: typeof customerActions.UPDATE_CUSTOMER_SUCCESS, payload: ICustomerResponses }
    | { type: typeof customerActions.MULTIPLE_DELETE_CUSTOMER_SUCCESS, payload: ICustomerResponses[] }


const customerReducer = (state: ICustomerState = initalState, action: customersActions): ICustomerState => {
    switch (action.type) {
        case customerActions.FETCH_CUSTOMER_REQUEST:
            return {
                ...state,
                customerLoading: true
            }
        case customerActions.FETCH_CUSTOMER_FAILURE:
            return {
                ...state,
                customerLoading: false,
                error: action.payload
            }
        case customerActions.FETCH_CUSTOMER_SUCCESS:
            return {
                ...state,
                customerLoading: false,
                customersResponse: action.payload
            }
        case customerActions.CREATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customerLoading: false,
                customersResponse: [...state.customersResponse, action.payload]
            }
        case customerActions.DELETE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customerLoading: false,
                customersResponse: state.customersResponse.filter(item => item._id !== action.payload._id)
            }
        case customerActions.SINGLE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customerLoading: false,
                customers: state.customers.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case customerActions.UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customerLoading: false,
                customersResponse: state.customersResponse.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case customerActions.MULTIPLE_DELETE_CUSTOMER_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedCustomerIds = action.payload.map((item) => item._id)
                return {
                    ...state,
                    customersResponse: state.customersResponse.filter((item) => !deletedCustomerIds.includes(item._id))
                };
            }
            return state;
        default: {
            return state
        }
    }
}

export default customerReducer;