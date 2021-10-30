import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    username:"",
    authFlag: false,
    //customerID: "",
    persona: "",
    name:""
} ;
const signupSlice = createSlice({
    initialState,
    name :"signupReducer",
    reducers:{
        setUsername: (state, action) => {
            state["username"]= action.payload
        },
        setName: (state, action) => {
            state["name"]= action.payload
        },
        setAuthFlag : (state,action) => {
            state["authFlag"] = action.payload
        },
        // setCustomerID : (state,action) => {
        //     console.log("CUST ID: ", action.payload);
        //     state["customerID"] = action.payload
        // },
        setPersona : (state,action) => {
            console.log("Persona: ", action.payload);
            state["persona"] = action.payload
        },
    }
});

export const {setUsername,setAuthFlag,setPersona, setName}=signupSlice.actions;
export default signupSlice.reducer;