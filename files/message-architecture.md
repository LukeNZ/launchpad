# msg:join

**Sent to**: No one.  
**Created by**: Any user.

Sent to the server by a client when they join the application. The client may include an optional authentication
token if they would like to be identified as a privileged user or moderator.

## Client to Server

    {
        token: <string?>
    }

# msg:typingStatus

**Sent to**: All users with `moderator` and `privileges`.  
**Created by**: All users with `moderator` and `privileges`.

Used to indicate whether a privileged user is typing a message.
 
## Client to Server

    {
        token: <string>,
        isTyping: <boolean>
    }

## Server to Client

    {
        id: <int>,
        user: <string>,
        timestamp: <datetime>,
        isTyping: <boolean>
    }
    
# msg:launchStatusCreate

**Sent to**: All connections.  
**Created by**: All users with `moderator` and `privileges`.

A new launch status. Usually a string of text, that is posted on live.rspacex.com, and on the reddit live thread. This may originate from a privileged user (either typed or via a launch status button press), or from a Twitter account being followed. If the former, the `author` property will be the username of that privileged user. If it is from the latter, the `author` property will be the Twitter username prefixed with `@`.

When the launch status from a privileged user, imgur photos & twitter photos will be automatically parsed and displayed when on live.rspacex.com. Tweet URL's will be automatically fetched from twitter and displayed, and the tweet text will be prepended to the tweet url. The same will occur when a tweet is automatically posted from a twitter account:

> `@elonmusk on Twitter: "<tweet text>" (<tweet url>)`

Acronyms will be expanded out into full form. "MECO" would become:

> `MECO (Main Engine Cutoff)`

Launch statuses can also affect the display of the application (such as the positioning of on-screen elements) when the "statusType" parameter is set to "moment", and are interwoven in the "Incoming Telemetry" timeline. These special statuses can only be played once. The server keeps track of which moments have been submitted and disallows any future moments of the same type. The client should disable the ability to send such an moments irregardless.

Moments can be any of the following types:

* Upcoming
* PropellantLoading
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

## Client to Server

    {
        token: <string>,
        statusType: "update"|"moment",
        momentType: <string?>,
        text: <string>
    }

## Server to Client

    {
        id: <int>,
        statusId: <int>,
        timestamp: <datetime>,
        source: "twitter"|"user",
        statusType: "update"|"moment",
        momentType: <string?>,
        user: <string>,
        text: <string>,
        isDeleted: <boolean>
    }

## Acknowledgement to Originating Client

    {
        responseCode: <int>
        response: <BroadcastedMessage>
    }

# msg:launchStatusEditRequest

**Sent to**: All users with `moderator` and `privileges`.  
**Created by**: All users with `moderator` and `privileges`.

Sent when a moderator or user requests, or cancels a request, to edit a launch status. When the server receives this, if it is a request to edit, it will mark the status as being edited, and all moderators and privileged users will be broadcast a notification that an status is being edited. Clients should grey out and prevent the ability to edit such an status until otherwise notified. 

If it is a cancellation request, the server will mark the update as not being edited. Clients are instructed to clear out the inability to edit the status.

## Client to Server

    {
        token: <string>,
        statusId: <int>,
        isRequesting: <boolean>
    }

## Server to Client

    {
        id: <int>,
        statusId: <int>,
        user: <string>,
        isRequesting: <boolean>
    }
    
## Acknowledgement to Originating Client

    {
        response: <int>,
        responseCode: <BroadcastedMessage>
    }


# msg:launchStatusEdit

**Sent to**: All connections.  
**Created by**: All users with `moderator` and `privileges`.

Occurs when a launch status is edited. Moderators may edit any launch status, even those not written by themselves. Users with privileges may only edit updates written by themselves. This event also frees the launch status, allowing it to be edited further.

## Client to Server

    {
        token: <string>,
        statusId: <int>,
        text: <string>
    }

## Server to Client

    {
        id: <int>
        statusId: <int>,
        timestamp: <datetime>,
        user: <string>,
        text: <string>
    }
    
## Acknowledgement to Originating Client

    {
        responseCode: <int>,
        response: <BroadcastedMessage>
    }

# msg:launchStatusDelete

**Sent to**: All connections.
**Created by**: All users with `moderator`.

When a launch status is deleted.

## Client to Server
    {
        token: <string>,
        statusId: <int>
    }

## Server to Client

    {
        statusId: <int>,
        user: <string>
    }

## Acknowledgement to Originating Client

    {
        responseCode: <int>
        response: <BroadcastedMessage>
    }
    
# msg:appStatus

**Sent to**: All connections.  
**Created by**: All users with `moderator`.

A status concerning the functionality of the application. This affects the display of the application in a substantial way (enabling and disabling of the application entirely, webcast enabling and disabling, etc).

## Client to Server

    {
        token: <string>,
        type: "enableApp"|"disableApp"|"editLaunch"|"editMoments",
        data: {
            // Additional optional metadata
        }
    }

## Server to Client
 
    {
        id: <int>,
        user: <string>,
        timestamp: <datetime>,
        type: "enableApp"|"disableApp"|"editLaunch"|"editMoments",
        data: {
            // Additional optional metadata
        }
    }

## Acknowledgement to Originating Client

    {
        responseCode: <int>,
        response: <BroadcastedMessage>
    }

# msg:livestreamStatus

**Sent to**: All connections.  
**Created by**: T Minus Ten.

## Server to Client

    {
        id: <int>,
        
    }
    