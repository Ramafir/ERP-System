import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import contractReducer from './contract/contractSlice';
import vacationReducer from './vacation/vacationSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        contract: contractReducer,
        vacation: vacationReducer
    }
});
