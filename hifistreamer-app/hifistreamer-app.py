import asyncio
import re
from jinja2 import Environment, FileSystemLoader

import tornado.web
import tornado.log

class MainHandler(tornado.web.RequestHandler):
    def post(self):
        id = int(self.get_arguments("device")[0])
        environment = Environment(loader=FileSystemLoader("."))
        template = environment.get_template("./templates/asound.in")
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
    return tornado.web.Application([
        (r"/audio", MainHandler),
        (r'/(.*)',tornado.web.StaticFileHandler, {'path': './www','default_filename':'index.html'})
    ])

async def main():
    app = make_app()
    app.listen(80)
    tornado.log.enable_pretty_logging()
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())