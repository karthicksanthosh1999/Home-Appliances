import * as userActions from '../Actions/userActions';

export interface IUser {
    _id?: string,
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    gender?: string;
    password: string;
    userType: string;
    profile: string;
    dob: string,
    doj: string,
    salary: string,
    address: string,
    branch: {
        branchName: string,
        branchId?: string,
        city: string,
        country: string,
        managerId: string,
        state: string,
        street: string,
        _id?: string
    }
}

interface IUserState {
    userLoading: boolean,
    users: IUser[],
    error: string | null
}

const initalState: IUserState = {
    userLoading: false,
    users: [],
    error: null,
}

type usersActions =
    | { type: typeof userActions.FETCH_USER_REQUEST }
    | { type: typeof userActions.DECODE_USER_SUCCESS, payload: IUser }
    | { type: typeof userActions.FETCH_USER_FAILURE, payload: string }
    | { type: typeof userActions.FETCH_USER_SUCCESS, payload: IUser[] }
    | { type: typeof userActions.SINGLE_USER_SUCCESS, payload: IUser }
    | { type: typeof userActions.CREATE_USER_SUCCESS, payload: IUser }
    | { type: typeof userActions.DELETE_USER_SUCCESS, payload: IUser }
    | { type: typeof userActions.UPDATE_USER_SUCCESS, payload: IUser }
    | { type: typeof userActions.MULTIPLE_DELETE_USER_SUCCESS, payload: IUser[] }


const customerReducer = (state: IUserState = initalState, action: usersActions): IUserState => {
    switch (action.type) {
        case userActions.FETCH_USER_REQUEST:
            return {
                ...state,
                userLoading: true
            }
        case userActions.FETCH_USER_FAILURE:
            return {
                ...state,
                userLoading: false,
                error: action.payload
            }
        case userActions.FETCH_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                users: action.payload
            }
        case userActions.CREATE_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                users: [...state.users, action.payload]
            }
        case userActions.DELETE_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                users: state.users.filter(item => item._id !== action.payload._id)
            }
        case userActions.DECODE_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                // signInUser : state.users.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case userActions.SINGLE_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                users: state.users.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case userActions.UPDATE_USER_SUCCESS:
            return {
                ...state,
                userLoading: false,
                users: state.users.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case userActions.MULTIPLE_DELETE_USER_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedUser = action.payload.map((item) => item?._id)
                return {
                    ...state,
                    users: state.users.filter((item) => !deletedUser.includes(item._id))
                };
            }
            return state; // Return the current state if payload is not valid
        default: {
            return state
        }
    }
}

export default customerReducer;