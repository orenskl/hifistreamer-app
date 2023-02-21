""" Audio subsystem API
    @Author Oren Sokoler
"""

import re

import tornado.web
import tornado.log

from hifistreamer_app.alsa import alsa_create_config

class AudioHandler(tornado.web.RequestHandler):
    """ Audio REST API handler
    """

    def post(self):
        """ Sets the current audio output device, accepts the device
            id as the parameter
            /audio?device=x
        """
        id = int(self.get_arguments("device")[0])
        alsa_create_config(id)
        self.add_header('Access-Control-Allow-Origin','*')
        self.write({})

    def get(self):
        """ Returns a json containing the audio devices in the system
            and the current used device
        """
        cards_json = {'current' : -1, "devices" : []}
        # Get the current device
        with open("/storage/.config/asound.conf", 'r') as file:
            lines = file.readlines()
            for line in lines:
                if re.search(r'^\s+card\s+\w',line):
                    current_device = line.split()[1].strip()
        # Get all the devices
        with open('/proc/asound/cards', 'r') as file:
            cards = file.readlines()
            index = 0
            for line in cards:
                if re.search(r'.*\: .*',line):
                    device_name = line.split(':')[1].strip()
                    cards_json['devices'].append({"id" : index, "name" : device_name})
                    device_abbrev = re.split('\[|\]',line)[1].strip()
                    if device_abbrev == current_device:
                        current = index
                    index += 1
            cards_json['current'] = current
            
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(cards_json)
