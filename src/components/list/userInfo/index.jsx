import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { useUserStore } from '../../../lib/useStore';
UserInfo.propTypes = {
    
};

function UserInfo(props) {
    const {currentUser} = useUserStore()
    return (
        <div className='userinfo'>
            <div className="user">
                <img src={currentUser.avatar || "./img/avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icon">
                <img src="./img/more.png" alt="" />
                <img src="./img/video.png" alt="" />
                <img src="./img/edit.png" alt="" />

            </div>
        </div>
    );
}

export default UserInfo;