import thunk from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "./slices/login";
import updateReducer from "../redux/slices/home";
import signupReducer from "./slices/signup";
import customerProfileReducer from './slices/customerProfile';
import restaurantProfileReducer from './slices/restaurantProfile';
const store = configureStore({
    reducer : {
        loginState: loginReducer,
        signupState: signupReducer,
        updateState: updateReducer,
        customerProfileState: customerProfileReducer,
        restaurantProfileState: restaurantProfileReducer
    },
    devTools : true,
    middleware : [thunk]
});

export default store;