import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    birthdate: "",
    address: "",
    location: "",
    city: "",
    State: "",
    country: "",
} ;
const customerProfileSlice = createSlice({
    initialState,
    name :"customerProfileReducer",
    reducers:{
        setName: (state, action) => {
            state["name"]= action.payload
        },
        setBirthdate: (state, action) => {
            state["birthdate"]= action.payload
        },
        setAddress: (state, action) => {
            state["address"]= action.payload
        },
        setLocation: (state, action) => {
            state["location"]= action.payload
        },
        setCity: (state, action) => {
            state["city"]= action.payload
        },
        setstate: (state, action) => {
            state["State"]= action.payload
        },
        setCountry: (state, action) => {
            state["country"]= action.payload
        },
        
        setPersona : (state,action) => {
            console.log("Persona: ", action.payload);
            state["persona"] = action.payload
        },
    }
});

export const {setName, setBirthdate, setAddress,setLocation,setCity,setstate,setCountry}=customerProfileSlice.actions;
export default customerProfileSlice.reducer;