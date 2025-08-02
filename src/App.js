
import React from 'react';
import SignUp from '../src/newcompoent/sinup';
import LogIn from '../src/newcompoent/login';
import FetchProducts from '../src/newcompoent/fetchproduct';
import PlaceOrder from '../src/newcompoent/placeorder';
import CancelOrder from '../src/newcompoent/cancelorder';
import Router from './Router'

const App = () => {
    return (
        <div>
            {/* <SignUp />
            <LogIn />
            <FetchProducts />
            <PlaceOrder />
            <CancelOrder /> */}
            <Router/>
        </div>
    );
};

export default App;

