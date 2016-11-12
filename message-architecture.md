# typingStatus

Sent to: All users with `moderator` and `privileges`.
Created by: All users with `moderator` and `privileges`.

Used to indicate whether a privileged user is typing a message. 

    {
        user: <string>,
        isTyping: <boolean>
    }
    
# createLaunchUpdate

Sent to: All connections.
Created by: All users with `moderator` and `privileges`.

A new launch update. Usually a string of text, that is posted on live.rspacex.com, and on the reddit live thread. This may originate from a privileged user (either typed or via a launch status button press), or from a Twitter account being followed. If the former, the `author` property will be the username of that privileged user. If it is from the latter, the `author` property will be the Twitter username prefixed with `@`.

When the launch update comes from a privileged user, imgur photos & twitter photos will be automatically parsed and displayed when on live.rspacex.com. Tweet URL's will be automatically fetched from twitter and displayed, and the tweet text will be prepended to the tweet url. The same will occur when a tweet is automatically posted from a twitter account:

> @elonmusk on Twitter: "<tweet text>" (<tweet url>)

Acronyms will be expanded out into full form. "MECO" would become:

> MECO (Main Engine Cutoff)

    {
        id: <int>
        timestamp: <datetime>,
        source: "twitter"|"user",
        author: <string>,
        text: <string>
    }

# editLaunchUpdate

Sent to: All connections.
Created by: All users with `moderator`.

When a launch update is edited. 

    {
        id: <int>,
        timestamp: <datetime>
        text: <string>
    }
    
# editLaunchUpdateStatus

Sent to: All users with `moderator` and `privileges`.
Created by: All users with `moderator`.


# deleteLaunchUpdate

Sent to: All connections.
Created by: All users with `moderator`.

When a launch update is deleted.

# launchStatus

Sent to: All connections.
Created by: All users with `moderator` and `privileges`.

A launch status, Launch statuses affect the display of the application (such as the positioning of on-screen elements), and are interwoven in the launch update timeline. Launch statuses can be any of the following types:

* startup
* liftoff

A timestamp is attached, as well as an originating author. 

    {
        id: <id>,
        timestamp: <datetime>,
        author: <string>
        statusType: <string>
    }

# appStatus

Sent to: All connections.
Created by: All users with `moderator`.

A status concerning the functionality of the application. This affects the display of the application in a substantial way (enabling and disabling of the application entirely, webcast enabling and disabling, etc).
 
    {
        
    }
