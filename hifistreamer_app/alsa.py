""" ALSA configuration utilities
    @Author Oren Sokoler
"""

import re

def alsa_create_config(id):
    """ Create the ALSA configuration file

    Args:
        id (int): The default ALSA device number (as listed in /proc/asound/cards)
    """
    asound_file = '''
    pcm.!default {
    type dmix
    ipc_key 1024
    slave {
        pcm "hw:__device__,0"
        rate 44100
        channels 2
        format S16_LE
        }
    }
    '''
    content = asound_file.replace('__device__',id)
    with open('/storage/.config/asound.conf', 'w') as file:    
        file.write(content)