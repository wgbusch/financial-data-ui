import json
from logging import exception

import requests
import uuid

from BatchRequest import BatchRequest


class SaxoConnection:
    SAXO_ENDPOINT = 'https://gateway.saxobank.com'
    INSTRUMENTS = '/sim/openapi/ref/v1/instruments?'
    EXCHANGES = '/sim/openapi/ref/v1/exchanges?'
    INSTRUMENT_DETAILS = '/v1/instruments/details/{0}/Stock'
    HOST = "gateway.saxobank.com"

    def __init__(self):
        self.token = "eyJhbGciOiJFUzI1NiIsIng1dCI6IjhGQzE5Qjc0MzFCNjNFNTVCNjc0M0QwQTc5MjMzNjZCREZGOEI4NTAifQ.eyJvYWEiOiI3Nzc3NSIsImlzcyI6Im9hIiwiYWlkIjoiMTA5IiwidWlkIjoiTWpISEFUQy18Z1RTUmNoSmIzeERPUT09IiwiY2lkIjoiTWpISEFUQy18Z1RTUmNoSmIzeERPUT09IiwiaXNhIjoiRmFsc2UiLCJ0aWQiOiIyMDAyIiwic2lkIjoiNzA5MGZkNDliMWE2NDE3YjlhYmRjMTNmZjZlNDAxNWMiLCJkZ2kiOiI4NCIsImV4cCI6IjE2MTAwNDU5ODIifQ.GyoXJbD_2kXue3kvR8_UQxDIVw_zTeYgci7vLSaM04xjudtuStuzYUyxp3OyIJiFsp8T0QtrqSJ5bOz_Dy4KWA"
        self.batchRequest = BatchRequest(self.token)

    # def get_quote(self, ticker):
    #     # defining a params dict for the parameters to be sent to the API
    #     PARAMS = {'address': location}
    #
    #     # sending get request and saving the response as response object
    #     r = requests.get(url=URL, params=PARAMS)
    #
    #     # extracting data in json format
    #     data = r.json()
    #     pass

    def parse_endpoint(self, param, endpoint_name):

        resp = ''
        resp += endpoint_name
        for key in param:
            if param[key] != None:
                resp += key + '=' + param[key] + '&'

        resp = resp.rstrip('&')
        return resp

    def get_instruments(self, Keywords=None, ExchangeId=None, AssetTypes='Stock', Symbol=None):

        headers = {'Authorization': 'Bearer ' + self.token,
                   'ContentType': 'application/json',
                   'Accept-Encoding': 'deflate',
                   'Accept': '*/*'}

        instruments_endpoint = self.SAXO_ENDPOINT + self.parse_endpoint({'Keywords': Keywords,
                                                                         'ExchangeId': ExchangeId,
                                                                         'AssetTypes': AssetTypes,
                                                                         'Symbol': Symbol},
                                                                        self.INSTRUMENTS)

        r = requests.get(url=instruments_endpoint, headers=headers)

        data = r.json()
        return data

    def get_exchanges(self):
        headers = {'Authorization': 'Bearer ' + self.token,
                   'ContentType': 'application/json',
                   'Accept-Encoding': 'deflate',
                   'Accept': '*/*'}

        exchanges_endpoint = self.SAXO_ENDPOINT + self.parse_endpoint({}, self.EXCHANGES)
        r = requests.get(url=exchanges_endpoint, headers=headers)

        data = r.json()
        return data

    # def get_options_subscriptions(self):
    def get_details(self, identifier):

        headers = {'Authorization': 'Bearer ' + self.token,
                   'ContentType': 'application/json',
                   'Accept-Encoding': 'deflate',
                   'Accept': '*/*'}

        instrument_details_endpoint = self.SAXO_ENDPOINT + self.INSTRUMENT_DETAILS.format(identifier)
        r = requests.get(url=instrument_details_endpoint, headers=headers)

        if r.status_code == 200:
            data = r.json()
        else:
            data = {"Message": r.headers}
        return data

    def batch_request(self, batch_list):

        for ticker in batch_list:
            instrument_endpoint = self.parse_endpoint({'Keywords': ticker,
                                                       'AssetTypes': 'Stock'},
                                                      self.INSTRUMENTS)

            self.batchRequest.add_request('GET', instrument_endpoint)

        result = self.batchRequest.execute_request()
        return result
