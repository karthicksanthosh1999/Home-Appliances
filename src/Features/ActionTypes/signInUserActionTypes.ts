import * as singinuseractions from '../Actions/signInUserActions';
import { ISignInUser } from '../Reducers/signInUserReducer';

export const fetchSigninUserRequest = () => ({
    type: singinuseractions.FETCH_SIGNIN_USER_REQUEST
})

export const fetchSigninUserSuccess = (signInUser: ISignInUser) => {
    return {
        type: singinuseractions.FETCH_SIGNIN_USER_SUCCESS,
        payload: signInUser
    }
}

export const fetchSigninUserFailure = (error: string) => ({
    type: singinuseractions.FETCH_SIGNIN_USER_FAILURE,
    payload: error
})


// Thunk

// export const getSigninUserThunk = () => async (dispatch: AppDispatch) => {
//     dispatch(fetchSigninUserRequest())
//     try {
//         const responses = await axios.get<{ responses: ISignInUser }>(`${BASE_URI}/api/auth/decode`);
//         dispatch(fetchSigninUserSuccess(responses.data.responses))
//         console.log(responses.data)
//     } catch (error: unknown) {
//         let errorMessage = "An unexpected error occurred";
//         if (error instanceof AxiosError && error.response) {
//             errorMessage = error.response.data.message;
//         } else if (error instanceof Error) {
//             errorMessage = error.message;
//         }
//         dispatch(fetchSigninUserFailure(errorMessage));
//     }
// }