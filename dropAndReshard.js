var getDbNames = function() { return db.adminCommand('listDatabases').databases.map(function(info) { return info.name; }); };
var assertOK = function(res) { assert(res.ok); };

if (getDbNames().indexOf("benchdb1") > 0) {
    print("benchdb1 exists, going to drop...");
    assertOK(db.getSiblingDB("benchdb1").dropDatabase());
    print("..dropped");
}

print("enabling sharding on benchdb1...");
assertOK(sh.enableSharding("benchdb1"));
print("..enabled");

for (var i = 0; i < 64; i++) {
    var col = "benchdb.COL-"  + i;
    print("about to shard " + col  + "...")
    assertOK(sh.shardCollection("benchdb1.COL-" + i, {"shardkey": "hashed"}));
    print("...done, " + i + "/64 completed");
}

