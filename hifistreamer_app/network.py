""" Network configuration API
    @Author Oren Sokoler
"""

import logging
import socket
import tornado.web
import tornado.log

import dbus
import pyconnman

log = logging.getLogger(__name__)

class NetworkHandler(tornado.web.RequestHandler):
    """ Network REST API handler
    """

    _HOSTNAME_PATH = '/storage/.cache/hostname'

    def post(self):
        """ Network configuration setting
            /networking?method=manual&address=1.2.3.4 ...
        """
        manager = pyconnman.manager.ConnManager()
        (path, params) = manager.get_services()[0]
        service = pyconnman.ConnService(path)
        # First handle the hostname
        name = self.get_arguments("name")[0]
        socket.sethostname(name)
        with open(self._HOSTNAME_PATH, "w") as file:
            file.write(name)    
        # Now the rest of the network settings
        conf = params['IPv4']
        method = self.get_arguments("method")[0]
        conf['Method'] = dbus.String(method, variant_level=1)
        nameservers = dbus.Array()
        if method == 'manual':
            address = self.get_arguments("address")[0]
            netmask = self.get_arguments("netmask")[0]
            gateway = self.get_arguments("gateway")[0]
            dns = self.get_arguments("dns")[0]
            log.info('Setting network configuration to : %s, addr = %s, mask = %s, gateway = %s, dns = %s, name = %s',
                      method, address, netmask, gateway, dns, name)
            conf['Address'] = dbus.String(address, variant_level=1)
            conf['Netmask'] = dbus.String(netmask, variant_level=1)
            conf['Gateway'] = dbus.String(gateway, variant_level=1)
            nameservers.append(dns)
        else:
            log.info('Setting network configuration to : %s, name = ', method, name)      
            nameservers.append('')  
        service.set_property('Nameservers.Configuration',nameservers)
        service.set_property('IPv4.Configuration', conf)
        self.add_header('Access-Control-Allow-Origin','*')
        self.write('{}')

    def get(self):
        """ Returns a json containing the status of the
            network configuration
        """
        manager = pyconnman.manager.ConnManager()
        (path, params) = manager.get_services()[0]
        network_json = {}
        log.info('State = %s',params['State'])
        network_json['name'] = socket.gethostname()
        if params['State'] in ('ready', 'online'):
            network_json['enabled'] = True
            network_json['method'] = params['IPv4']['Method']
            network_json['address'] = params['IPv4']['Address']
            network_json['netmask'] = params['IPv4']['Netmask']
            network_json['gateway'] = params['IPv4']['Gateway']
            network_json['dns'] = params['Nameservers'][0]
        else:
            network_json['enabled'] = False
        self.add_header('Access-Control-Allow-Origin','*')
        self.write(network_json)
