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

```echo 0 > /proc/sys/vm/zone_reclaim_mode```
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


## Running a trial
