from __future__ import print_function

import csv
import subprocess
import time
import itertools

BAR = "=" * 80

MONGORESTORE= '/Users/amidvidy/Documents/gitroot/mongo-tools/bin/mongorestore'
HOST= 'localhost'
PORT= '27017'

OUT_FILE='results-{}.csv'.format(time.time())

MIN_PARALLEL_COLLECTIONS = 1
MAX_PARALLEL_COLLECTIONS = 64

def trial(parallelCollections):
    print(BAR)
    print("Trial Starting - params: TODO")
    print("starting mongorestore...")
    start = time.time()
    subprocess.call([MONGORESTORE,
                     "--host={}".format(HOST),
                     "--numParallelCollections={}".format(parallelCollections),
                     "--drop", # drop collections before restoring to account for old runs
    ])
    total = time.time() - start
    print("...restore completed in {} seconds".format(total))
    return total

def main():
    with open(OUT_FILE, 'wb') as outfile:
        writer = csv.DictWriter(outfile, delimiter=',', fieldnames=['parallelCollections', 'elapsedTime'])
        writer.writeheader()
        parallelCollections = MIN_PARALLEL_COLLECTIONS
        while parallelCollections <= MAX_PARALLEL_COLLECTIONS:
            run = {
                'parallelCollections': parallelCollections,
                'elapsedTime': trial(parallelCollections),
            }
            writer.writerow(run)
            parallelCollections *= 2

if __name__ == '__main__':
    main()

