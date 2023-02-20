import argparse
import asyncio
import pkg_resources
import os

import tornado.web
import tornado.log

from alsa import *
from audio import *
from about import *

def make_app():
    """ Create the web application

    Returns:
        tornado.web.Application: The main application
    """
    www_path = pkg_resources.resource_filename('hifistreamer-app', 'www')
    return tornado.web.Application([
        (r"/audio", AudioHandler),
        (r"/about", AboutHandler),
        (r'/(.*)',tornado.web.StaticFileHandler, {'path': www_path,'default_filename':'index.html'})
    ])

async def main():
    """ Main entry point
    """
    if not os.path.isfile('/storage/.config/asound.conf'):
        alsa_create_config(0)
    parser = argparse.ArgumentParser(description='Port number')
    parser.add_argument('--port', type=int, dest='port_num', default=80)
    args = parser.parse_args()
    app = make_app()
    app.listen(args.port_num)
    tornado.log.enable_pretty_logging()
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())