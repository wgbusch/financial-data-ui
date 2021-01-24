import csv
import re

exportList = []


class TickersController:

    def __init__(self):
        with open('data\otherlisted.txt') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter='|')
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    print(f'Column names are {", ".join(row)}')
                    line_count += 1
                else:
                    # global exportList
                    exportList.append({"symbol": row[0], "name": row[1], "is_etf": row[4]})
                    line_count += 1
            print(f'Processed {line_count} lines.')

    def get_others(self):
        return list(filter(lambda ticker: not bool(re.search('\$[A-Z]|File Creation Time|\.[A-Z]', ticker["symbol"])),
                           exportList))
