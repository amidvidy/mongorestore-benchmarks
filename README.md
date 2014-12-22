# mongorestore benchmarks

## Generating the test dataset

1. Run `mongo generate-data.js` locally to generate a 2GB test dataset.
2. Run `mongodump --db=benchdb1` to dump the dataset to a BSON file.
