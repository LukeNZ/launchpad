local cjson = require "cjson"
local data = cjson.decode(ARGV[1])
data[KEY[2]] = redis.call("llen", KEY[1])
redis.call("rpush", KEY[1], cjson.encode(data))