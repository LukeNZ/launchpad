# Welcome to the r/SpaceX {{=title}} Official Launch Discussion & Updates Thread!

{{=it.launch.introduction}}

### Watching the launch live

To watch the launch live, pick your preferred streaming provider from the table below. Can't pick? [Read about the differences](/r/spacex/wiki/faq/watching#wiki_i.27m_online._where_can_i_watch_the_launch.2C_what_streams_should_i_watch.2C_and_how_can_i_participate_in_the_discussion.3F).

{{? it.livestreams }}
| [r/SpaceX Live (Webcasts + Live Updates)](https://live.rspacex.com) |
| --- |
{{? '' in it.spacexHostedIsAvailable}}
| **[SpaceX Hosted Webcast (YouTube)](https://youtube.com/watch?v={{=it.spacexHostedVideoId}})** |
{{?}}
{{? it.spacexTechnicalIsAvailable}}
| **[SpaceX Technical Webcast (YouTube)](https://youtube.com/watch?v={{=it.spacexTechnicalVideoId}})** |
{{?}}
{{? it.nasaIsAvailable}}
| **[NASA TV (YouTube)](https://youtube.com/watch?v={{=it.nasaVideoId}})** |
| **[NASA TV (Ustream)](http://www.ustream.tv/nasahdtv)** |
{{?}}
{{?}}

### Official Live Updates

| Time | Countdown | Update |
| --- |--- | --- |
{{ for (var status in it.launchStatuses) { }}
| {{#def.formattedUTCTime(status)}} | {{#def.relativeTime(status)}} | {{=status.text}} |
{{ } }}

{{ for(var section in it.launch.descriptionSections) { }}
### {{=section.title}}

{{=section.text }}
{{ } }}

### Useful Resources, Data, ♫, & FAQ
{{ for (var resource in it.launch.resources) { }}
{{? resource.courtesy !== null}}
* [{{=resource.title}}]({{=resource.url}}), {{=resource.courtesy}}
{{??}}
* [{{=resource.title}}]({{=resource.url}})
{{?}}
{{ } }}

### Participate in the discussion!

* First of all, launch threads are party threads! We understand everyone is excited, so we relax the rules in these venues - low effort comments are allowed. The most important thing is that everyone enjoy themselves :D
* All other threads are fair game. We will remove low effort comments elsewhere!
* Real-time chat on our official Internet Relay Chat (IRC) [#spacex at irc.esper.net](https://kiwiirc.com/client/irc.esper.net/?nick=SpaceX_guest%7C?#SpaceX). Please read the IRC rules [here](https://www.irccloud.com/pastebin/U4CMHwUk) before participating.
* Please post small launch updates, discussions, and questions here, rather than as a separate post. Thanks!

### Previous r/SpaceX Live Events

Check out previous r/SpaceX Live events in the [Launch History page](http://www.reddit.com/r/spacex/wiki/launches) on our community Wiki.

{{##def.formattedUTCTime = function(status) {
    return moment().toString();
}
#}} 

{{##def.relativeTime = function(status) {
    return moment().toString();
}
#}}