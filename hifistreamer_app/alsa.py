""" ALSA configuration utilities
    @Author Oren Sokoler
"""

import re

def alsa_create_config(id):
    """ Create the ALSA configuration file

    Args:
        id (int): The default ALSA device number (as listed in /proc/asound/cards)
    """
    asound_file = 'pcm.!default {\n    type hw\n    card __device__\n    device 0\n}\n'
    with open('/proc/asound/cards', 'r') as file:
        cards = file.readlines()
        index = 0
        for line in cards:
            if re.search(r'.*\: .*',line):
                device_abbrev = re.split('\[|\]',line)[1].strip()
                if index == id :
                    content = asound_file.replace('__device__',device_abbrev)
                    break
                index += 1
    with open('/storage/.config/asound.conf', 'w') as file:    
        file.write(content)