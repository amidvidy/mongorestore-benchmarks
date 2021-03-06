from __future__ import print_function

import csv
import subprocess
import time
import itertools

BAR = "=" * 80

MONGO= '.'
MONGORESTORE= '/Users/amidvidy/Documents/gitroot/mongo-tools/bin/mongorestore'
HOST= 'localhost'
PORT= '27017'

SHARDED = True

OUT_FILE='results-{}.csv'.format(time.time())

MIN_PARALLEL_COLLECTIONS = 1
MAX_PARALLEL_COLLECTIONS = 64

def trial(parallelCollections):
    print(BAR)
    print("Trial Starting - params: numParallelCollections = {}".format(parallelCollections))
    if SHARDED:
        print("dropping DB and resharding...")
        subprocess.call([MONGO, "{}:{}".format(HOST, PORT), "dropAndReshard.js"])
    print("starting mongorestore...")


    restoreOpts = [MONGORESTORE,
                   "--dir=benchdb1",
                   "--db=benchdb1",
                   "--host={}".format(HOST),
                   "--numParallelCollections={}".format(parallelCollections),
    ]

    if not SHARDED:
        # on a sharded collection we use dropAndReshard, running with --drop would actually be wrong since
        # we would need to reshard the collection
        restoreOpts.append("--drop")
    start = time.time()
    subprocess.call(restoreOpts)
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
            outfile.flush()
            parallelCollections *= 2

if __name__ == '__main__':
    main()

