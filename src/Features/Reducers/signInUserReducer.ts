import * as singinuseractions from '../Actions/signInUserActions';
import { IBranch } from './branchReducer';


export interface ISignInUser {
    userId: string,
    userType: string,
    profile: string,
    firstName: string,
    lastName: string,
    branch: string,
    mobile: string,
    email: string
}
export interface ISignInUserResponses {
    userId: string,
    userType: string,
    profile: string,
    firstName: string,
    lastName: string,
    branch: IBranch,
    mobile: string,
    email: string
}

interface ISignInUserState {
    loading: boolean,
    error: string | null,
    signInUser: ISignInUser,
}

const initalState: ISignInUserState = {
    loading: false,
    error: null,
    signInUser: {
        userId: "",
        userType: '',
        profile: "",
        firstName: "",
        lastName: "",
        branch: "",
        mobile: "",
        email: ""
    }
}

type SigninUserActions =
    | { type: typeof singinuseractions.FETCH_SIGNIN_USER_FAILURE, payload: string }
    | { type: typeof singinuseractions.FETCH_SIGNIN_USER_REQUEST }
    | { type: typeof singinuseractions.FETCH_SIGNIN_USER_SUCCESS, payload: ISignInUser }


const signinUserReducer = (state: ISignInUserState = initalState, action: SigninUserActions): ISignInUserState => {
    switch (action.type) {
        case singinuseractions.FETCH_SIGNIN_USER_SUCCESS:
            return {
                ...state,
                signInUser: action.payload,
                loading: false
            }
        case singinuseractions.FETCH_SIGNIN_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case singinuseractions.FETCH_SIGNIN_USER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        default:
            return state;
    }
}

export default signinUserReducer;