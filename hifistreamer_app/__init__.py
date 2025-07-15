import os
from pkg_resources import get_distribution
import configparser

setup_cfg_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'setup.cfg')
if os.path.isfile(setup_cfg_path):
    config = configparser.ConfigParser()
    config.read(setup_cfg_path)
    __version__ = config['metadata']['version']
else:
    __version__ = get_distribution('hifistreamer_app').version