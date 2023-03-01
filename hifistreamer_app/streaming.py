""" Streaming services API
    @Author Oren Sokoler
"""

import logging
import tornado.web
import tornado.log

log = logging.getLogger(__name__)

class StreamingHandler(tornado.web.RequestHandler):
    """ Streaming REST API handler
    """

    def initialize(self, tidal):
        self.tidal = tidal

    def post(self):
        """ Streaming service enable / disable
            /streaming?tidal=x
        """
        enable = self.get_arguments("tidal")[0]
        result = {}
        if enable == 'true':
            link = self.tidal.enable()
            if link:
                result['link'] = link
        else:
            self.tidal.disable()
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(result)

    def get(self):
        """ Returns a json containing the status of all the
            streaming services.
        """
        tidal_json = {}
        if self.tidal.is_waiting():
            tidal_json['waiting'] = True
        else:
            tidal_json['waiting'] = False
            tidal_json['enabled'] = self.tidal.is_enabled()
        services_json = { 'TIDAL' : tidal_json }
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(services_json)
