import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { auth } from '../../lib/firebase';
import { useUserStore } from '../../lib/useStore';
import { useChatStore } from '../../lib/chatStore';

Detail.propTypes = {

};

function Detail(props) {
    const {
        chatId, user, isCurrentUserBlocked, isReceiverBlocked, changBlock
    } = useChatStore();

    const { currentUser } = useUserStore();
    const handleBlock = () => {

    }
    return (
        <div className='detail'>
            <div className='user'>
                <img src={user.avartar || "./img/avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>fasdfsad</p>
            </div>
            <div className='info'>
                <div className="option">
                    <div className="title">
                        <span>Chat Setting</span>
                        <img src="./img/arrowUp.png" alt="" srcset="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Share Photo</span>
                        {<img src="./img/arrowDown.png" alt="" srcset="" />}
                    </div>
                    <div className="photos">
                        <div className='photoItem'>
                            <div className="photoDetail">
                                <img src="./img/avatar.png" alt="" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./img/download.png" alt="" className='iconDownload' />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./img/arrowUp.png" alt="" srcset="" />
                    </div>
                </div>
                <button onClick={handleBlock}> Block User</button>
                <button className='logout' onClick={() => auth.signOut()}> Logout</button>

            </div>

        </div>
    );
}

export default Detail;