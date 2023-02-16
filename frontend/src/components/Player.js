import React from 'react';
import '../css/Page.css';

function Player(props) {
    return (
        <div className='Page-container'>
          <iframe title='Mopidy-Iris' 
                  src='http://music:6680/iris' 
                  className='Page-content'/>
        </div>
    );
}

export default Player;