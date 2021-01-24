# Raw Package
from datetime import datetime as dt
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
from options_logic import add_detail_grid_columns

VIEWS_DIRECTORY = "data/views/"


def save_columns_state(req):
    if not os.path.exists(VIEWS_DIRECTORY):
        os.mkdir(VIEWS_DIRECTORY)
    json_wrapper_for_view = {"isLatest": 1,
                             "updateDate": str(dt.now().utcnow()),
                             "data": req}
    try:
        f = open(VIEWS_DIRECTORY + 'views.txt', "r+")
        views = json.load(f)
        f.seek(0)
        for view in views:
            view["isLatest"] = 0
        views.append(json_wrapper_for_view)
        json.dump(views, f)
        f.close()
    except Exception as e:
        list_of_views = [json_wrapper_for_view]
        with open(VIEWS_DIRECTORY + 'views.txt', 'w') as json_file:
            json.dump(list_of_views, json_file)
    return None


def get_columns_state(view_name):
    if not os.path.exists(VIEWS_DIRECTORY):
        os.mkdir(VIEWS_DIRECTORY)

    try:
        f = open(VIEWS_DIRECTORY + 'views.txt', "r+")
        views = json.load(f)
        views = list(filter(lambda view_item: view_item["isLatest"] == 1, views))
        if (len(views) > 1):
            return {}
        return json.dumps(views[0]["data"])
    except Exception as e:
        return {}
