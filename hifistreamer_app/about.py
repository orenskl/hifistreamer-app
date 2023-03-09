""" System about API
    @Author Oren Sokoler
"""

import re

import psutil
import tornado.web
import tornado.log

class AboutHandler(tornado.web.RequestHandler):

    def sizeof_fmt(self, num, suffix="B"):
        for unit in ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"]:
            if abs(num) < 1024.0:
                return f"{num:3.1f}{unit}{suffix}"
            num /= 1024.0
        return f"{num:.1f}Yi{suffix}"

    def get(self):
        about_json = {}
        with open('/etc/release', 'r') as file:
            about_json['version'] = file.read().split('-')[1]
        with open('/proc/cpuinfo', 'r') as file:
            lines = file.readlines()
            for line in lines:
                if re.search(r'^model name',line):
                    about_json['processor'] = line.split(':')[1].strip()
        about_json['memory'] = self.sizeof_fmt(psutil.virtual_memory().total)
        disk_total = self.sizeof_fmt(psutil.disk_usage('/storage').total)
        disk_free = self.sizeof_fmt(psutil.disk_usage('/storage').free)
        about_json['disk'] = disk_total + " (" + disk_free + " Free)"
        with open('/proc/version', 'r') as file:
            content = file.read().split(' ')
            about_json['kernel'] = content[0] + ' ' + content[1] + ' ' + content[2]
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(about_json)
    