# msg:join

**Sent to**: No one.
**Created by**: Any user.

Sent to the server by a client when they join the application. The client may include an optional authentication
token if they would like to be identified as a privileged user or moderator. 

## Client to Server

    {
        token: <string>
    }

# msg:typingStatus

**Sent to**: All users with `moderator` and `privileges`.  
**Created by**: All users with `moderator` and `privileges`.

Used to indicate whether a privileged user is typing a message.
 
## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        isTyping: <boolean>
    }

## Server to Client

    {
        event_id: <int>,
        user: <string>,
        isTyping: <boolean>
    }
    
# msg:createLaunchUpdate

**Sent to**: All connections.  
**Created by**: All users with `moderator` and `privileges`.

A new launch update. Usually a string of text, that is posted on live.rspacex.com, and on the reddit live thread. This may originate from a privileged user (either typed or via a launch status button press), or from a Twitter account being followed. If the former, the `author` property will be the username of that privileged user. If it is from the latter, the `author` property will be the Twitter username prefixed with `@`.

When the launch update comes from a privileged user, imgur photos & twitter photos will be automatically parsed and displayed when on live.rspacex.com. Tweet URL's will be automatically fetched from twitter and displayed, and the tweet text will be prepended to the tweet url. The same will occur when a tweet is automatically posted from a twitter account:

> `@elonmusk on Twitter: "<tweet text>" (<tweet url>)`

Acronyms will be expanded out into full form. "MECO" would become:

> `MECO (Main Engine Cutoff)`

## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        text: <string>
    }

## Server to Client

    {
        event_id: <int>,
        update_id: <int>,
        timestamp: <datetime>,
        source: "twitter"|"user",
        author: <string>,
        text: <string>
    }

# msg:editLaunchUpdateRequest

**Sent to**: All users with `moderator` and `privileges`.  
**Created by**: All users with `moderator` and `privileges`.

Sent when a moderator or user wants to edit a launch update. When the server receives this it will mark the update as being edited, and all moderators and privileged users will be broadcast a notification that an update is being edited. Clients should grey out and prevent the ability to edit such an update until otherwise notified. 

## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        update_id: <int>
    }

## Server to Client

    {
        event_id: <int>
        user: <string>,
        update_id: <int>
    }

# msg:editLaunchUpdateCancellation

**Sent to**: All users with `moderator` and `privileges`.  
**Created by**: All users with `moderator` and `privileges`.

Sent when a moderator or user cancels a launch update edit. When the server receives this, it will note the update as being unedited

# msg:editLaunchUpdate

**Sent to**: All connections.  
**Created by**: All users with `moderator` and `privileges`.

Occurs when a launch update is edited. Moderators may edit any launch update, even those not written by themselves. Users with privileges may only edit updates written by themselves. This event frees the launch update, allowing it to be edited.

## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        update_id: <int>,
        text: <string>
    }

## Server to Client

    {
        update_id: <int>,
        timestamp: <datetime>,
        user: <string>,
        text: <string>
    }
    

# msg:deleteLaunchUpdate

**Sent to**: All connections.
**Created by**: All users with `moderator`.

When a launch update is deleted.

## Client to Server

## Server to Client

# launchStatus

**Sent to**: All connections.  
**Created by**: All users with `moderator` and `privileges`.

A launch status. Launch statuses affect the display of the application (such as the positioning of on-screen elements), and are interwoven in the launch update timeline. Launch statuses can only be played once. The server keeps track of what launch statuses have been submitted and disallows any future launch statuses of the same type. The client should disable the ability to send such a launch status in any event.

Launch statuses can be any of the following types:

* Startup (Occurs at T-60s)
* Liftoff
* MaxQ
* MECO
* StageSeparation
* SecondStageIgnition
* FirstStageBoostbackStartup
* FirstStageBoostbackShutdown
* FairingSeparation
* FirstStageReentryStartup
* FirstStageReentryShutdown
* FirstStageLandingStartup
* FirstStageTransonic
* Touchdown
* LandingSuccess
* SECO
* SecondStageRelight
* SECO2
* DragonDeploy
* PayloadDeploy
* LaunchSuccess
* LaunchFailure
* PauseCountdown
* ResumeCountdown
* Scrub

A timestamp is attached, as well as an originating author. 

## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        statusType: <string>,
        data: {
            // Additional metadata
        }
    }

## Server to Client

    {
        event_id: <int>,
        id: <int>,
        timestamp: <datetime>,
        author: <string>,
        statusType: <string>,
        data: {
            // Additional metadata
        }
    }

# msg:appStatus

**Sent to**: All connections.  
**Created by**: All users with `moderator`.

A status concerning the functionality of the application. This affects the display of the application in a substantial way (enabling and disabling of the application entirely, webcast enabling and disabling, etc).

App statuses can be of the following types:

* EnableApp
* DisableApp
* EditWebcastData
* EditLaunchData

## Client to Server

    {
        user: <string>,
        key: <string>,
        uid: <string>,
        statusType: <string>,
        data: {
            // Additional metadata
        }
    }

## Server to Client
 
    {
        event_id: <int>,
        user: <string>,
        timestamp: <datetime>,
        statusType: <string>,
        data: {
            // Additional metadata
        }
    }

## Acknowledgement to Originating Client

    {
        uid: <string>,
        statusCode: <int>,
        data: {
            // Additional metadata
        }
    }
