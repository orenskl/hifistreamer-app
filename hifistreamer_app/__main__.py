""" Module main file
    @Author Oren Sokoler
"""

import argparse
import asyncio
import pkg_resources
import os
import logging

import tornado.web
import tornado.log

from hifistreamer_app.alsa import alsa_create_config
from hifistreamer_app.audio import AudioHandler
from hifistreamer_app.about import AboutHandler
from hifistreamer_app.streaming import StreamingHandler
from hifistreamer_app.tidal import TIDAL
from hifistreamer_app import __version__


log = logging.getLogger(__name__)

def make_app():
    """ Create the web application

    Returns:
        tornado.web.Application: The main application
    """
    www_path = pkg_resources.resource_filename('hifistreamer_app', 'www')
    return tornado.web.Application([
        (r"/audio", AudioHandler),
        (r"/about", AboutHandler),
        (r"/streaming", StreamingHandler, dict(tidal=TIDAL())),
        (r'/(.*)',tornado.web.StaticFileHandler, {'path': www_path,'default_filename':'index.html'})
    ])

async def main():
    """ Main entry point
    """
    logging.basicConfig(filename='/var/log/hifistreamer-app.log', level=logging.DEBUG, format='%(asctime)s %(name)s %(levelname)s %(message)s')
    log.info('hifistreamer-app version ' + __version__)
    if not os.path.isfile('/storage/.config/asound.conf'):
        log.info('Creating default ALSA configuration')
        alsa_create_config(0)
    parser = argparse.ArgumentParser(description='Port number')
    parser.add_argument('--port', type=int, dest='port_num', default=6690)
    args = parser.parse_args()
    app = make_app()
    app.listen(args.port_num)
    tornado.log.enable_pretty_logging()
    log.info('Running Web server')
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())