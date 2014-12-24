var getDbNames = function() { return db.adminCommand('listDatabases').databases.map(function(info) { return info.name; }); };
var check = function(res) { print("got: " + JSON.stringify(res)); assert(res.ok); };
var flush = function() { check(db.adminCommand('flushRouterConfig')); }

sh.stopBalancer();
assert(!sh.getBalancerState());
flush();

if (getDbNames().indexOf("benchdb1") >= 0) {
    print("benchdb1 exists, going to drop...");
    check(db.getSiblingDB("benchdb1").dropDatabase());
    print("..dropped");
    flush();
}

print("enabling sharding on benchdb1...");
check(sh.enableSharding("benchdb1"));
print("..enabled");
flush();

for (var i = 0; i < 64; i++) {
    var col = "benchdb1.COL-"  + i;
    print("about to shard " + col  + "...")
    check(sh.shardCollection(col, {"shardkey": "hashed"}));
    flush();
    print("...done, " + i + "/64 completed");
}
