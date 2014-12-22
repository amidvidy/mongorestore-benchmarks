# mongorestore benchmarks

## Setup

### Generating the test dataset

1. Run `mongo generate-data.js` locally to generate a 6GB test dataset.
2. Run `mongodump --db=benchdb1` to dump the dataset to a BSON file.

### Configuring the test hosts

We used AWS m3.large.

#### Prelude (for all hosts)

- Download mongodb 2.8.0rc3

```wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.8.0-rc3.tgz```

```tar -zxvf mongo*```

```cd mongo*/bin; export PATH=`pwd`:$PATH```

- Install numactl and Disable NUMA

```sudo apt-get install numactl```

```sudo su root -c "echo 0 > /proc/sys/vm/zone_reclaim_mode"```

- Disable transparent hugepages

```sudo su root -c "echo never > /sys/kernel/mm/transparent_hugepage/enabled"```

- Create scratch directory on ephemeral storage

```sudo mkdir /mnt/data```

```sudo chown ubuntu /mnt/data/```

### Per-Configuration Setup

#### Configuration A (Single MongoD)

- Start MongoDB in a standalone configuration.

```mkdir /mnt/data/mongo-standalone```

```numactl --interleave=all mongod --dbpath /mnt/data/mongo-standalone --logpath /mnt/data/mongo-standalone/mongo-standalone.log --logappend --storageEngine=wiredtiger --fork```

#### Configuration B (Single Shard)

- On **MONGOD HOST** start a config server on port 27019

```mkdir /mnt/data/configsvr```

```numactl --interleave=all mongod --dbpath /mnt/data/configsvr --logpath /mnt/data/configsvr/configsvr.log --logappend --storageEngine=wiredtiger --port 27019 --fork```

- On **MONGOS HOST** start a mongos on port 27017

```mkdir /mnt/data/mongos```

```numactl --interleave=all mongos --configdb <hostname of MONGOD HOST>:27019 --logpath /mnt/data/mongos/mongos.log --fork```

- On **MONGOD HOST** start a mongod on port 27018

```mkdir /mnt/data/mongod-shard1```

```numactl --interleave=all mongod --dbpath /mnt/data/mongod-shard1 --logpath /mnt/data/mongod-shard1/mongod-shard1.log --logappend --storageEngine=wiredtiger --port 27018 --fork```

- Now on **MONGOS HOST** set up dat sharding

```mongo 27019```

```sh.addShard("<mongoD host>:27018")```

```sh.enableSharding("benchdb1")```

```for (var i = 0; i < 64; i++) { sh.shardCollection("benchdb1.COL-" + i", {"shardkey": "hashed"}); }```

## Running a trial
