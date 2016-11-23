# When a message arrives at the server

When a message is sent to the server over websockets, it will always come with a title prefixed with `msg:`. At this point, it should be logged as an even, with all message data and a user (if present) being passed to the log event functionality.

# 

