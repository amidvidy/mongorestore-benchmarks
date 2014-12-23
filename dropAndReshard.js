db.getSiblingDB("benchdb1").dropDatabase();
sh.enableSharding("benchdb1");
for (var i = 0; i < 64; i++) {
  assert(sh.shardCollection("benchdb1.COL-" + i, {"shardkey": "hashed"}).ok);
}
