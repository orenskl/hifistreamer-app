/**
 * The player page
 * @author Oren Sokoler
 */

import {getAPIurl} from './Config.js'

import React from 'react';
import '../css/Page.css';

/**
 * Render the Mopidy-Iris player in an iframe
 */
function Player() {
    return (
        <div className='Page-container'>
          <iframe title='Mopidy-Iris' 
                  src={getAPIurl() + '/iris/'}
                  className='Page-content'/>
        </div>
    );
}

export default Player;