import * as branchActions from '../Actions/branchActions';

export interface IBranch {
    _id?: string,
    branchName: string,
    branchId?: string,
    city: string,
    country: string,
    managerId: string,
    state: string,
    street: string
}

interface IBranchState {
    loading: boolean,
    error: string | null,
    branches: IBranch[]
}

const initalState: IBranchState = {
    error: null,
    branches: [],
    loading: false
}

type branchesActions =
    | { type: typeof branchActions.FETCH_BRANCH_REQUEST }
    | { type: typeof branchActions.FETCH_BRANCH_FAILURE, payload: string }
    | { type: typeof branchActions.FETCH_BRANCH_SUCCESS, payload: IBranch[] }
    | { type: typeof branchActions.SINGLE_BRANCH_SUCCESS, payload: IBranch }
    | { type: typeof branchActions.CREATE_BRANCH_SUCCESS, payload: IBranch }
    | { type: typeof branchActions.DELETE_BRANCH_SUCCESS, payload: IBranch }
    | { type: typeof branchActions.UPDATE_BRANCH_SUCCESS, payload: IBranch }
    | { type: typeof branchActions.MULTIPLE_BRANCH_SUCCESS, payload: IBranch[] }

const branchReducer = (state: IBranchState = initalState, action: branchesActions): IBranchState => {
    switch (action.type) {
        case branchActions.FETCH_BRANCH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case branchActions.FETCH_BRANCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case branchActions.FETCH_BRANCH_SUCCESS:
            return {
                ...state,
                loading: false,
                branches: action.payload
            }
        case branchActions.CREATE_BRANCH_SUCCESS:
            return {
                ...state,
                loading: false,
                branches: [...state.branches, action.payload]
            }
        case branchActions.DELETE_BRANCH_SUCCESS:
            return {
                ...state,
                loading: false,
                branches: state.branches.filter(item => item._id !== action.payload._id)
            }
        case branchActions.UPDATE_BRANCH_SUCCESS:
            return {
                ...state,
                loading: false,
                branches: state.branches.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case branchActions.SINGLE_BRANCH_SUCCESS:
            return {
                ...state,
                loading: false,
                branches: state.branches.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case branchActions.MULTIPLE_BRANCH_SUCCESS:
            return {
                ...state,
                branches: state.branches.filter(item => !action.payload.includes(item))
            }
        default: {
            return state
        }
    }

}

export default branchReducer;