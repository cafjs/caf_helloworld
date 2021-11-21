# Caf.js

Co-design permanent, active, stateful, reliable cloud proxies with your web app and IoT devices.

See https://www.cafjs.com

## A simple collaboration app with Caf.js

An intro video in [here](https://youtu.be/GxkEPjvy0b4) describes the implementation of this app.

This video also covers the WAB architecture, the command line tools, crash resilience, and the Caf.js Cloud. Use the links in the YouTube page if you just want to see the app.

The CA (Cloud Assistant) autonomously increments a counter, and queues a notification when the counter is a multiple of five. It also exports an API that forces an increment.

CAs can also follow other CAs, ensuring that counters are always in sync. When we create a cycle of CAs following each other, updates stop for a while, but CAs eventually detect it, breaking the deadlock.

With about 100 lines of Javascript, this example is a concise Caf.js introduction to persistent sessions, the pubsub service, reliable state, the trusted bus, proactive programming, and much more...
