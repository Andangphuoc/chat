import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
Notifycation.propTypes = {
    
};

function Notifycation(props) {
    
    return (
        <div>
            <ToastContainer position='bottom-right'></ToastContainer>
        </div>
    );
}

export default Notifycation;