import argparse
import asyncio
import re
from jinja2 import Environment, FileSystemLoader
import pkg_resources

import tornado.web
import tornado.log

class MainHandler(tornado.web.RequestHandler):
    def post(self):
        id = int(self.get_arguments("device")[0])
        templates_path = pkg_resources.resource_filename('hifistreamer-app', 'templates')
        environment = Environment(loader=FileSystemLoader(templates_path))
        template = environment.get_template("asound.in")
        with open('/proc/asound/cards', 'r') as file:
            cards = file.readlines()
            index = 0
            for line in cards:
                if re.search(r'.*\: .*',line):
                    device_abbrev = re.split('\[|\]',line)[1].strip()
                    print(id,index,device_abbrev)
                    if index == id :
                        content = template.render( device = device_abbrev )
                        break
                    index += 1
        with open('/storage/.config/asound.conf', 'w') as file:    
            file.write(content)
        self.add_header('Access-Control-Allow-Origin','*')
        self.write({})

    def get(self):
        cards_json = {'current' : -1, "devices" : []}
        # Get the current device
        with open("/storage/.config/asound.conf", 'r') as file:
            lines = file.readlines()
            for line in lines:
                if re.search(r'^\s+card\s+\w',line):
                    current_device = line.split(' ')[3].strip()
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

def make_app():
    www_path = pkg_resources.resource_filename('hifistreamer-app', 'www')
    return tornado.web.Application([
        (r"/audio", MainHandler),
        (r'/(.*)',tornado.web.StaticFileHandler, {'path': www_path,'default_filename':'index.html'})
    ])

async def main():
    parser = argparse.ArgumentParser(description='Port number')
    parser.add_argument('--port', type=int, dest='port_num')
    args = parser.parse_args()
    app = make_app()
    app.listen(args.port_num)
    tornado.log.enable_pretty_logging()
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())