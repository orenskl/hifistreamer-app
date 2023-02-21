""" System about API
    @Author Oren Sokoler
"""

import re

import psutil
import tornado.web
import tornado.log

class AboutHandler(tornado.web.RequestHandler):
     def get(self):
        about_json = {}
        with open('/etc/release', 'r') as file:
            about_json['version'] = file.read().split('-')[1]
        with open('/proc/cpuinfo', 'r') as file:
            lines = file.readlines()
            for line in lines:
                if re.search(r'^model name',line):
                    about_json['processor'] = line.split(':')[1].strip()
        about_json['memory'] = str(round(psutil.virtual_memory().total / (1024 * 1024 * 1024),1)) + " GB"
        disk_total = str(round(psutil.disk_usage('/storage').total / (1024 * 1024 * 1024),1)) + " GB"
        disk_free = str(round(psutil.disk_usage('/storage').free / (1024 * 1024 * 1024),1)) + " GB"
        about_json['disk'] = disk_total + " (" + disk_free + " Free)"
        with open('/proc/version', 'r') as file:
            content = file.read().split(' ')
            about_json['kernel'] = content[0] + ' ' + content[1] + ' ' + content[2]
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(about_json)
    