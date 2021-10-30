import thunk from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "./slices/login";
import updateReducer from "../redux/slices/home";
import signupReducer from "./slices/signup"
const store = configureStore({
    reducer : {
        loginState: loginReducer,
        signupState: signupReducer,
        updateState:updateReducer,
    },
    devTools : true,
    middleware : [thunk]
});

export default store;