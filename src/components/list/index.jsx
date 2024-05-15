import React from 'react';
import PropTypes from 'prop-types';
import ChatList from './chatList';
import UserInfo from './userInfo';
import './styles.css'
List.propTypes = {
    
};

function List(props) {
    return (
        <div className='list'>
            <UserInfo></UserInfo>
            <ChatList></ChatList>
        </div>
    );
}

export default List;