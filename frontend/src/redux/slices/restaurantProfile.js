import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    location: "",
    cuisine:"",
    deliveryMode: "",
    dietary:"",
    description: "",
    phoneNo: "",
    email:"",
    address: "",
    timings:""
} ;
const restaurantProfileSlice = createSlice({
    initialState,
    name :"restaurantProfileReducer",
    reducers:{
        setName: (state, action) => {
            state["name"]= action.payload
        },
        setLocation: (state, action) => {
            state["location"]= action.payload
        },
        setCuisine: (state, action) => {
            state["cuisine"]= action.payload
        },
        setDeliveryMode: (state, action) => {
            state["deliveryMode"]= action.payload
        },
        setDietary: (state, action) => {
            state["dietary"]= action.payload
        },
        setDescription: (state, action) => {
            state["description"]= action.payload
        },
        setPhoneNo: (state, action) => {
            state["phoneNo"]= action.payload
        },
        setEmail : (state,action) => {
            state["email"] = action.payload
        },
        setAddress : (state,action) => {
            state["address"] = action.payload
        },
        setTimings: (state, action) => {
            state["timings"] = action.payload
        },
    }
});

export const {setName, setLocation, setCuisine, setDeliveryMode,setDietary,setDescription ,setPhoneNo,setEmail,setAddress,setTimings}=restaurantProfileSlice.actions;
export default restaurantProfileSlice.reducer;