# Raw Package
from datetime import datetime as dt
import datetime
import os
import re
import sys
import time

import dateutil
import numpy as np
import pandas as pd
import json

# Data Source
import yfinance as yf

# Data viz
import plotly.graph_objs as go
from tqdm import tqdm
from joblib import Parallel, delayed, parallel_backend
import multiprocessing

import calculator
from SaxoConnection import SaxoConnection
from TickersController import TickersController
from db import db


def get_options_expiry_dates(symbol):
    data = yf.Ticker(symbol)
    try:
        expiry_dates = data.options
    except Exception as e:
        return json.dumps({"data": [],
                "columnDefs": add_detail_grid_columns(),
                "expiryDates": []})

    option_chain = []
    for date in expiry_dates:
        df_option_chain = data.option_chain(date)
        df_option_chain.calls["expiryDate"] = np.array(date)
        df_option_chain.puts["expiryDate"] = np.array(date)
        df_option_chain.calls["callOrPut"] = np.array("call")
        df_option_chain.puts["callOrPut"] = np.array("put")
        df_option_all = df_option_chain.calls.append(df_option_chain.puts)
        option_chain.append(df_option_all)

    return json.dumps({"data": json.loads(pd.concat(option_chain).to_json(orient="records")),
                       "columnDefs": add_detail_grid_columns(),
                       "expiryDates": expiry_dates})


def add_detail_grid_columns():
    columns_to_retrieve = []
    with open('data/OPTIONS_COLUMNS_MAP.txt') as f:
        columns_map = json.load(f)
    for column in columns_map.keys():
        columns_to_retrieve.append(columns_map[column])
    return columns_to_retrieve
