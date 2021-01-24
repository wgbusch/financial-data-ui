import pandas as pd
from tqdm import tqdm

# Data Source
import yfinance as yf


class db:
    def __init__(self):
        self.HISTORICAL_DATA_FOLDER = 'data/historical_data/'
        self.MARKET_DATA_FOLDER = 'data/market_data/'
        self.OPTIONS_DIRECTORY = "data/options/"

    def get_from_historical_data(self, symbols, tick='1d', interval=1):
        response = []
        for symbol in tqdm(symbols):
            file_name = self.HISTORICAL_DATA_FOLDER + symbol + "_" + tick + ".csv"
            df = pd.read_csv(file_name)
            if (len(df) > 0):
                response.append(df.iloc[[-interval]])
        return pd.concat(response)

    def save_to_historical_data(self, dataframes_for_symbols, tick='1d'):
        errors = []
        for df_symbol in dataframes_for_symbols:
            file_name = self.HISTORICAL_DATA_FOLDER + df_symbol["Symbol"] + "_" + tick + ".csv"
            try:
                df = pd.read_csv(file_name)
                df.append(df_symbol)
                df.to_csv(file_name)
            except Exception:
                errors.append(df_symbol["Symbol"])
        return errors

    def get_options_expiry_dates(self, symbol):
        options_filename = self.OPTIONS_DIRECTORY + symbol + ".csv"
        try:
            df = pd.read_csv(options_filename)
        except Exception as e:
            print("Missing options file..." + str(e))
            data = yf.Ticker(symbol)
            df = data.options
            df.to_csv(options_filename)

        return None
