var NCOLLECTIONS = 64;
var TOTAL_DATA_SIZE_BYTES = 6 * (1 << 30); // 6GB

function randomString(len) {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}


var DATA_PER_COLLECTION_BYTES = Math.ceil(TOTAL_DATA_SIZE_BYTES / NCOLLECTIONS);
var SHARDKEY_BYTES = 24
var PAYLOAD_BYTES = 450;

function genDoc() {
  return {
    "_id": ObjectId(),
    "shardkey": randomString(SHARDKEY_BYTES),
    "payload": randomString(PAYLOAD_BYTES)
  };
}

// very approximate
var DOC_BYTES = "_id".length
              + 12 // oid len
              + "shardkey".length
              + SHARDKEY_BYTES
              + "payload".length
              + PAYLOAD_BYTES;

var DOCS_PER_COLLECTION = Math.ceil(DATA_PER_COLLECTION_BYTES / DOC_BYTES);
var BULK_OP_SIZE_DOCS = 1000;
var BULK_OPS_PER_COLLECTION = Math.ceil(DOCS_PER_COLLECTION / BULK_OP_SIZE_DOCS);

var db = db.getSiblingDB("benchdb1")

print("Inserting " + DOCS_PER_COLLECTION + " docs per collection")

for (var i = 0; i < NCOLLECTIONS; ++i) {
  var col = db.getCollection("COL-" + i);
  for (var j = 0; j < DOCS_PER_COLLECTION;) {
    var bulk = col.initializeUnorderedBulkOp();
    var k; // need to print k after for loop
    for (k = 0; (k < BULK_OP_SIZE_DOCS) && (j < DOCS_PER_COLLECTION); ++k, ++j) {
      bulk.insert(genDoc());
    }
    bulk.execute();
    print("executed bulk op successfully: inserted " + k + " docs")
  }
}


