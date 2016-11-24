local data = cjson.decode(ARGV[1])
data[KEYS[2]] = redis.call("llen", KEYS[1])
redis.call("rpush", KEYS[1], cjson.encode(data))
return data[KEYS[2]]