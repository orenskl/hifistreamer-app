""" ALSA configuration utilities
    @Author Oren Sokoler
"""

import os
import re
import logging
import json

log = logging.getLogger('alsa')

JSON_PATH  = '/storage/.hifistreamer-app/db.json'
DEVICE_KEY = 'audio_device'

def alsa_init():
    """ Create and initialize the ALSA configuration files
    """

    # Create a pllace to save the device name
    os.makedirs('/storage/.hifistreamer-app', exist_ok=True)
    
    # Read the last used device from the db file
    last_used_device = None
    if os.path.isfile(JSON_PATH):
        with open(JSON_PATH, 'r') as json_file:
            db = json.load(json_file)
            last_used_device = db.get(DEVICE_KEY, None)
 
    found = False
    if last_used_device is not None:
        # Find the device id from /proc/asound/cards
        with open('/proc/asound/cards', 'r') as file:
            lines = file.readlines()
            for line in lines:
                match = re.match(r'\s*(\d+)\s+\[(\S+)\s+.*\]:\s+(.*)', line)
                if match and match.group(3) == last_used_device:
                    device_id = int(match.group(1))
                    found = True
                    log.info(f'Creating ALSA configuration for last used device: {last_used_device} (id {device_id})')
                    alsa_create_config(device_id, False)
                    break
    
    if last_used_device is None or not found:
        log.info('Creating default ALSA configuration')
        alsa_create_config(0)
    
def alsa_create_config(id, update_name=True):
    """ Create the ALSA configuration file

    Args:
        id (int): The default ALSA device number (as listed in /proc/asound/cards)
        update_name (bool): Whether to update the stored device name
    """
    asound_file = '''pcm.!default {
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
    content = asound_file.replace('__device__',str(id))
    with open('/storage/.config/asound.conf', 'w') as file:    
        file.write(content)
        
    if update_name:
        # Store the device name for the next boot
        with open('/proc/asound/cards', 'r') as file:
            lines = file.readlines()
            for line in lines:
                match = re.match(r'\s*(\d+)\s+\[(\S+)\s+.*\]:\s+(.*)', line)
                if match and int(match.group(1)) == id:
                    device_name = match.group(3)
                    # Save device name in a json file
                    db = {}
                    db[DEVICE_KEY] = device_name
                    with open(JSON_PATH, 'w') as json_file:
                        json.dump(db, json_file)
                    break
