## Integrated web-chat using Networked AFrame and WebRTC

To demo this you first need the Python server up and running:

> python server.python

There should be a working build in the **dist** directory. If you go there and kick off a local server (in this case node's http-server)...


``` 
> http-server
Starting up http-server, serving ./   
Available on:                         
  http://127.0.0.1:8080               
  http://192.168.1.92:8080            
  http://172.17.0.1:8080              
Hit CTRL-C to stop the server         

```

... you should be able to go to localhost:8080/index_chat.html. From here you can kick off two VR chat instances, Bonny and Clyde. The parameters for position, color, name are set in the URL parameters:

> http://localhost:8081/chat-room.html?color=f00&pos=0:1.6:1&rot=0:0:0&name=bonny&host=true

The **webrtc** component is set on AFrame's **scene** with video currently off:

> webrtc="video:false"

There should be synchronized controller hands - the component is hand-crafted and may well be flaky at the moment. I'll be in a postion to stress test with a few Quests soon.

## Building the demo

I'm using the node based **Parcel**, a JS bundler, which is configuration free. Running the following from root should build a fresh demo based on any code changes:

> node_modules/.bin/parcel build index_chat.html

To develop with hot-loading (this can be a bit flaky with ghost avatars etc. and might need restarting occasionally) just run parcel in dev mode:

> node_modules/.bin/parcel index_chat.html


Welcome to Glitch
=================

Click `Show` in the header to see your app live. Updates to your code will instantly deploy and update live.

**Glitch** is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more [about Glitch](https://glitch.com/about).


Your Project
------------

### ← README.md

That's this file, where you can tell people what your cool website does and how you built it.

### ← index.html

Where you'll write the content of your website. 

### ← style.css

CSS files add styling rules to your content.

### ← script.js

If you're feeling fancy you can add interactivity to your site with JavaScript.

### ← assets

Drag in `assets`, like images or music, to add them to your project

Made by [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
