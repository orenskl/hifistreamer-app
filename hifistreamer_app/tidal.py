""" TIDAL service 
    @Author Oren Sokoler
"""

import json
import logging
import configparser
import os
import tidalapi

log = logging.getLogger(__name__)

class TIDAL():
    """ TIDAL services class
    """

    _MOPIDY_CONF_PATH  = '/storage/.config/mopidy/mopidy.conf'
    _NETWORK_CONF_PATH = '/storage/.cache/hifistreamer/network_wait'

    _TIDAL_OAUTH_FILE  = 'tidal-oauth.json'
    _TIDAL_OAUTH_DIR   = '/storage/.mopidy/tidal/'

    def __init__(self):
        self.future = None
        self.session = None

    def _set_wait_for_network(self, wait_flag):
        """ Set the wait for network on boot flag

        Args:
            wait_flag (bool): If True the system will wait for network on boot
        """
        with open(self._NETWORK_CONF_PATH, 'w') as file:
            if wait_flag:
                file.write('WAIT_NETWORK_TIME="30"\n')
        
    def _restart(self):
        """ Restart Mopidy service
        """
        log.info("Restarting Mopidy")
        os.system('systemctl restart mopidy.service')

    def _enable(self,enable_flag):
        """ Enable or disable TIDAL in mopidy

        Args:
            enable_flag (bool): If True enable TIDAL
        """
        current = self.is_enabled()
        value = 'false'
        if enable_flag:
            value = 'true'
        config = configparser.ConfigParser()
        config.read(self._MOPIDY_CONF_PATH)
        if not config.has_section('tidal'):
            config.add_section['tidal']
        config.set('tidal','enabled',value)
        with open(self._MOPIDY_CONF_PATH, 'w') as file:
            config.write(file)
        log.info('current = %r, enable_flag = %r',current,enable_flag)
        if current != enable_flag:
            self._set_wait_for_network(enable_flag)
            self._restart()

    def enable(self):
        """ Enable the TIDAL service

        Returns:
            str : Link to login to TIDAL or None
        """
        if self.is_enabled():
            return None
        if os.path.isfile(self._TIDAL_OAUTH_DIR + self._TIDAL_OAUTH_FILE):
            self._enable(True)
            return None
        self.session = tidalapi.Session()
        login, self.future = self.session.login_oauth()
        log.info('Waiting on this link : ' + login.verification_uri_complete)
        return login.verification_uri_complete

    def disable(self):
        """ Disable the TIDAL service
        """
        self._enable(False)

    def is_waiting(self):
        """ Returns True if waiting for user authentication
        """
        rv = True
        if self.future is None:
            rv = False
        else:
            if self.future.done():
                self.future = None
                is_login_ok = self.session.check_login() 
                log.info('Login completed with check_login = %r',is_login_ok)
                # Save the credentials for mopidy startup
                if is_login_ok:
                    try:
                        os.mkdir(self._TIDAL_OAUTH_DIR)
                    except Exception:
                        log.debug('%s already exists',self._TIDAL_OAUTH_DIR)
                    data = {}
                    data["token_type"] = {"data": self.session.token_type}
                    data["session_id"] = {"data": self.session.session_id}
                    data["access_token"] = {"data": self.session.access_token}
                    data["refresh_token"] = {"data": self.session.refresh_token}
                    with open(self._TIDAL_OAUTH_DIR + self._TIDAL_OAUTH_FILE, "w") as outfile:
                        json.dump(data, outfile)    
                    self._enable(True)
                else:
                    self._enable(False)                                    
                rv = False
        return rv 

    def is_enabled(self):
        """ Returns True if TIDAL service is enabled
        """               
        config = configparser.ConfigParser()
        config.read(self._MOPIDY_CONF_PATH)
        try:
            if config['tidal']['enabled'] == 'true':
                return True
        except KeyError:
            pass
        return False
        
