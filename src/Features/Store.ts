import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './Reducers/userReducer';
import branchReducer from './Reducers/branchReducer';
import customerReducer from './Reducers/cutomerReducer';
import productReducer from './Reducers/productReducer';
import employeeReducer from './Reducers/employeeReducer';
import invoiceReducer from './Reducers/invoiceReducer';
import leadReducer from './Reducers/leadReducer';
import signinUserReducer from './Reducers/signInUserReducer';
import quotationReducer from './Reducers/quotationReducer';
import deliveryReducer from './Reducers/deliveryReducer';
import giftReducer from './Reducers/giftReducer';
import giftAssignReducer from './Reducers/giftAssignReducer';

const rootReducer = combineReducers({
    user: userReducer,
    branch: branchReducer,
    cutomer: customerReducer,
    product: productReducer,
    employee: employeeReducer,
    Invoice: invoiceReducer,
    lead: leadReducer,
    signInUser: signinUserReducer,
    quotation: quotationReducer,
    delivery: deliveryReducer,
    gift: giftReducer,
    giftAssign: giftAssignReducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare()
})

export type Rootstate = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch;

export default store;