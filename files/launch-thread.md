# Welcome to the r/SpaceX {{ launch.name }} Official Launch Discussion & Updates Thread!

{{- launch.introduction -}}

### Watching the launch live

To watch the launch live, pick your preferred streaming provider from the table below. Can't pick? [Read about the differences](/r/spacex/wiki/faq/watching#wiki_i.27m_online._where_can_i_watch_the_launch.2C_what_streams_should_i_watch.2C_and_how_can_i_participate_in_the_discussion.3F).

{% if livestreams %}
| [r/SpaceX Launchpad (Webcasts + Live Updates)](https://live.rspacex.com) |
| --- |
{%- if isLivestreamAvailable('SpaceX Hosted') %}
| **[SpaceX Hosted Webcast (YouTube)](https://youtube.com/watch?v=)** |
{%- endif %}
{%- if isLivestreamAvailable('SpaceX Technical') %}
| **[SpaceX Technical Webcast (YouTube)](https://youtube.com/watch?v=)** |
{%- endif %}
{%- if isLivestreamAvailable('NASA') %}
| **[NASA TV (YouTube)](https://youtube.com/watch?v=)** |
| **[NASA TV (Ustream)](http://www.ustream.tv/nasahdtv)** |
{%- endif %}
{%- endif %}

### Live Updates

| Time | Countdown | Update |
| --- |--- | --- |
{%- for status in launchStatuses %}
| {{ formattedUTCTime(status) }} | {{ relativeTimeToLaunch(status) }} | {{ acronymize(status.text) }} |
{%- endfor %}

{%-for section in launch.descriptionSections %}
### {{ section.title }}

{{ section.description }}
{%- endfor %}

### Useful Resources, Data, ♫, & FAQ
{%- for resource in launch.resources -%}
{%- if resource.note !== null -%}
* [{{ resource.title }}]({{ resource.url }}), {{ resource.note }}
{%- else -%}
* [{{ resource.title }}]({{ resource.url }})
{%- endif -%}
{%- endfor -%}

### Participate in the discussion!

* First of all, launch threads are party threads! We understand everyone is excited, so we relax the rules in these venues - low effort comments are allowed. The most important thing is that everyone enjoy themselves!
* All other threads continue to be subject to our strict rules. Report any rule-breaking comments that you see.
* Please post small launch updates, discussions, and questions here, rather than as a separate post. Thanks!

### Previous r/SpaceX Live Events

Check out previous r/SpaceX Live events in the [Launch History page](http://www.reddit.com/r/spacex/wiki/launches) on our community Wiki.