import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    username:"",
    authFlag: false,
    //customerID: "",
    persona:""
} ;
const loginSlice = createSlice({
    initialState,
    name :"loginReducer",
    reducers:{
        setUsername: (state, action) => {
            state["username"]= action.payload
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
        setCustomerID:(state,action) => {
            console.log("CustomerID: ", action.payload);
            state["CustomerID"] = action.payload
        },
    }
});

export const {setUsername,setAuthFlag,setPersona,setCustomerID}=loginSlice.actions;
export default loginSlice.reducer;