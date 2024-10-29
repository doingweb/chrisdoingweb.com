---
title: How do we make a "Backend"?
subtitle: A really basic demonstration of the client-server relationship, using Node.js.
date: 2024-10-28
tags:
  - frontend
  - backend
  - full-stack
  - javascript
  - nodejs
---

{{< lead >}}
Setting up a server-side for an app can feel like a really intimidating thing, especially for someone new to web development. Let's forego the frameworks and other fancy stuff, and just get down to the details that really matter.
{{< /lead >}}

<!--more-->

Check out the 👉 [companion GitHub repo](https://github.com/doingweb/minimal-client-server) if you want to pull it and follow along! Or maybe you just want to cut straight to the code and that's enough for you. Sounds like something I'd do.

## Prerequisites

I'm gonna assume you:

* Have worked with [plain text](https://en.wikipedia.org/wiki/Plain_text) files, including [HTML](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics), and maybe even built a [basic website](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web#the_story_of_your_first_website).
* Know enough about the [terminal](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line) (or "command line", "shell", etc.) to navigate and run commands.
* Have a basic understanding of how the web works, i.e. that a server's job is to send HTML to a web browser, which renders it for a visitor to use, that URLs are how you address a server, and the [basics of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Session).
* Are familiar with programming concepts like variables, functions, switch-case, and [async/await](https://en.wikipedia.org/wiki/Async/await), as well as the syntax of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps).
* Are interested in building web apps, and finding out what people mean when they say "backend".

## The Frontend

Here's our `index.html`:

```html
<html>
  <head>
    <script>
      async function getNewCatName() {
        const response = await fetch('http://localhost:3000/cat');
        const newName = await response.text();

        const catNameElement = document.getElementById('cat-name-goes-here');
        catNameElement.textContent = newName;
      }
    </script>
  </head>
  <body>
    <button onclick="getNewCatName()">Get cat name 🐈</button> <span id="cat-name-goes-here"></span>
  </body>
</html>
```

### Line-by-line

Let's start on that one line in our page's body:

```html
<button onclick="getNewCatName()">Get cat name 🐈</button> <span id="cat-name-goes-here"></span>
```

We have a button that will invoke the JavaScript function we defined in the `<script>` above. Also keep that `<span>` in the back of your mind for now.

Now imagine we click on that button, and the browser starts executing our `getNewCatName` function:

```js
const response = await fetch('http://localhost:3000/cat');
```

The first thing the function does is invoke [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) as plainly as we can, just with the URL of our server _endpoint_. When invoked this way, without any further specifics, it [defaults to the `GET` method](https://fetch.spec.whatwg.org/#concept-request-method).

```js
const newName = await response.text();
```

This gets us the body of the response, treated like UTF-8 text.

_Why_ wouldn't _the body be text? Can it be other stuff?_ Yeah totally! Your (or someone else's) endpoint could return _anything_ made up of bytes. It's up to your code that deals with the response to decide what to do with it. You should know exactly what to do before you start writing any code though, thanks to API docs.

_Hey why do we need to `await` that? Didn't the previous line do the async network stuff?_ Great question! Indeed, the `fetch()` deals with that initial async network contact stuff, but one of the cool-but-a-little-obscure features of HTTP is that it can ✨ _stream_ ✨. As in, you can start working with the data before all of it actually makes it to the web browser. You're probably already quite familiar with this concept from watching videos online. Anyway, since streaming is built into HTTP, the [response body API](https://fetch.spec.whatwg.org/#bodies) encapsulated in `response` uses a stream to access the body data, and since that is something inherently async (i.e. we need to keep pulling chunks out until we have them all), things like `text()` must also be async.

Also, fun fact, the thing that pulls chunks until we have them all is called the ["consume body algorithm"](https://fetch.spec.whatwg.org/#concept-body-consume-body) 🧟

_"UTF-8"?_ Yeah so that's the way to encode text that the web has just kinda landed on. There's other encodings out there, but they're no longer very common as far as web development is concerned. Thankfully 😌

```js
const catNameElement = document.getElementById('cat-name-goes-here');
```

Hey, we're talking about that `<span>`! You remembered it, right? This just grabs that element from the DOM so we can...

```js
catNameElement.textContent = newName;
```

...change its content! Nothing fancy. The browser will act like we'd written the HTML with the cat's name between those tags all along.

### Try it!

So, at this point, we only have a frontend, but go ahead and try opening it in your browser as a file! Open up the [devtools](https://developer.mozilla.org/en-US/docs/Glossary/Developer_Tools) and explore a little. Does the browser have any problems with it? What if you try pressing the button before we set up the backend? Do things break? If so, how badly?

## The Backend

Here's our `server.mjs`:

```js
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/':
      const indexHtmlPath = path.resolve('index.html');
      const html = await fs.readFile(indexHtmlPath, 'utf-8');

      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html);
      break;
    case '/cat':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(getRandomCatName());
      break;
    default:
      res.writeHead(404).end();
      break;
  }
});

server.listen(3000);
console.log('🤖 SERVER STARTED.');

function getRandomCatName() {
  // These are all real cats.
  const catNames = ['Gerald', 'Sadie', 'Fat Tina', 'Fufu', 'Tofu', 'Chairman Meow', 'Whiskers', 'Deckard', 'Walter', 'Annie', 'Razzy', 'Tiger', 'Shadow'];

  return catNames[Math.floor(Math.random() * catNames.length)];
}
```

### Line-by-line

```js
const server = http.createServer(async (req, res) => {
```

All the stuff inside this block is our definition for the server! It's expressed as a function where we get the `req` (the HTTP request), which we can use to access any details about the request we might need, and `res` (the HTTP response), which is how we control what gets sent back to the browser.

_Side note_: Normally I'd spell out variables rather than use abbreviations like this, but `req` and `res` are a common enough convention in this kind of server code that they shouldn't be any less clear. If it would help you or your teammates in _your_ code though, even a little, go ahead and spell it out 🙂

```js
switch (req.url) {
```

Let's look at the URL that was requested and...

```js
case '/':
```

...if it's for the homepage (i.e. `http://localhost:3000/`), we'll serve out the homepage (our `index.html` file we looked at above).

A couple quick vocabulary things: The act of examining the requested URL (and perhaps other details like method) and deciding what code to use to respond to it, is referred to as **routing**. The URLs that an app defines are its **endpoints**. And sometimes, one might interchangeably refer to an endpoint as a **route**.

Okay, back to serving out that homepage!

```js
const indexHtmlPath = path.resolve('index.html');
```

First, we need to get the path to the file. This [gets the absolute path](https://nodejs.org/api/path.html#pathresolvepaths), given just the filename (and the assumption that we're starting from the current working directory, the "CWD" — the same directory that this code lives in).

```js
const html = await fs.readFile(indexHtmlPath, 'utf-8');
```

We [read the entire file at once](https://nodejs.org/api/fs.html#fspromisesreadfilepath-options), decoding it as UTF-8. There's UTF-8 again!

```js
res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
```

Remember how HTTP is a streaming kind of protocol? That shows through here, because we must [write the headers of the HTTP response](https://nodejs.org/api/http.html#responsewriteheadstatuscode-statusmessage-headers) first, since that's always the first part of the message we send back to the browser. In this case, we send the [200 OK status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200), and just one header signaling that the content of the body will be HTML encoded in UTF-8.

```js
res.end(html);
```

Since we have the entire body content ready in our `html` variable, we just send it along and signal that [the response is complete](https://nodejs.org/api/http.html#responseenddata-encoding-callback).

And that's it for the `/` endpoint! We just get that HTML from the file and send it over HTTP. A lot of more complicated web engineering is based around this simple premise. What if we wanted to add some templating to our HTML file, so certain values get stuck in there right before we send it off? What if those values come from a database? An API? There's tons of possibilities.

```js
case '/cat':
```

Okay, now we're gonna define that `/cat` endpoint we `fetch` in the frontend.

```js
res.writeHead(200, {'Content-Type': 'text/plain'});
```

We start with headers similar to the other endpoint, except we're not sending HTML specifically, just some generic plain text. Although, there's nothing stopping you from sending HTML; as long as your clients (i.e. your frontend) are able to work with it.

```js
res.end(getRandomCatName());
```

And we're just sending whatever we get back from `getRandomCatName()`! I actually won't go into this function at all. Let's just assume the person who wrote it [wouldn't surprise you](https://deviq.com/principles/principle-of-least-astonishment) with anything unexpected and that it simply returns a string containing a cat's name at random. Feel free to read the code yourself of course, but after you do, please just ask yourself if you really _had_ to spend your time doing that.

```js
res.writeHead(404).end();
```

The `default` case is our [404 Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) path, which, when you're designing an HTTP API, is of course important to include for when an unexpected URL is requested. I'm sure you've had experience with this kind of situation, and this is one way you can implement it!

Oh and you might have noticed that we just tacked on the `.end()` there. This is known as a "[fluent interface](https://en.wikipedia.org/wiki/Fluent_interface)", and is one of these clever things that API designers sometimes do, in an effort to let code that uses their API be a little easier to read. It would be equivalent to just write the headers and then put a `res.end()` on the following line.

```js
server.listen(3000);
```

Now that we have fully defined our server, we can start it up! A server's job is to _listen_ for connections, so `listen` is the name of the method for this. Oh and we're having it listen on [port](https://en.wikipedia.org/wiki/Port_(computer_networking)) 3000, which is just an arbitrary number. Although I guess I picked 3000 because it's often used for web servers that a developer runs on their local machine while they're developing, so they can test their code 🤔 Anyway, if you're someone who develops and runs other servers, port 3000 might be in use already, so if you can't start this server later because of that, just stop the other server or change the port number here.

```js
console.log('🤖 SERVER STARTED.');
```

Servers will often have a log line like this, just as a conclusive signal that all the server config and startup has succeeded. Feel free to add your own flavor.

### Try it!

To run the server, just point Node.js at the code:

```console
node server.mjs
```

Then you can visit [http://localhost:3000](http://localhost:3000/) and see the thing in action! The `/` route gets the HTML to the browser, then when you click the button, the `/cat` route returns that cat name and it shows up on the page:

{{< cloudinary-video name="minimal-client-server-cat-endpoint-working" >}}

### HTML from the file vs. HTML from the server

Now that we have the backend in place, try opening up the HTML **file** in the browser again and click the button:

{{< cloudinary-video name="xnssoeco1nwghtxlu0ew" >}}

It doesn't work!! What gives??

Well, imagine that instead of pointing at our silly cat endpoint, we pointed at, say, a bank's backend API. And rather than simply displaying the text we get back, the page looks and acts more or less like the bank, and silently sends the information it fetches to some other server. I'm sure you get the idea here — we don't want pages we might not trust to be able to make requests to sensitive APIs and exfiltrate that data.

That's where [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) comes in; it prevents malicious pages from getting access to things they shouldn't. There's a bit more to it, but this is the part we need to worry about today. On your web journey, you'll probably come across it over and over, whether it's setting up more complex apps that involve multiple origins, or when you're just trying to test something and forget that it's a thing. Anyway, that's what's happening here; the browser has our back and is not letting this random HTML file get at our API. To get the browser to cooperate and hand us what the API returns, we need to have loaded the page from the _same origin_. Hence why we needed to implement that `/` route!

## Conclusion

So that's _the backend_! We explored a few of the core aspects of bridging browsers and servers: Routing, encoding, ports, HTTP, even a little CORS. Whatever language, runtime, or framework you choose to work in, these concepts will be relevant, since they're essential to how the web works.
