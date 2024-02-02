const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Links used for the redirect
const OBJKT_LINK =
  "https://objkt.com/users/tz2JyW132finpXHFNCSrHtcBEHRmwp5ffYks";
const FXHASH_LINK =
  "https://www.fxhash.xyz/u/Daniel%20Oropeza";
const SUPERRARE_LINK =
  "https://superrare.com/ferdoropeza";
const TWITTER_LINK =
  "https://twitter.com/ferdoropeza";

const server = http.createServer((req, res) => {
  // GET / (Index Route)
  // Return a frame which renders an image with four redirect buttons
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`
      <html>
         <head>   
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width"/>
            <meta property="og:title" content="FC Dev Call" />
            <meta property='og:image' content="https://farcaster-dev-call-frame.vercel.app/image" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://farcaster-dev-call-frame.vercel.app/image" />
            <meta property="fc:frame:button:1" content="SuperRare" />
            <meta property="fc:frame:button:1:action" content="post_redirect" />
            <meta property="fc:frame:button:2" content="Objkt" />
            <meta property="fc:frame:button:2:action" content="post_redirect" />
            <meta property="fc:frame:button:3" content="Twitter" />
            <meta property="fc:frame:button:3:action" content="post_redirect" />
            <meta property="fc:frame:button:4" content="Fxhash" />
            <meta property="fc:frame:button:4:action" content="post_redirect" />
            <meta property="fc:frame:post_url" content="https://farcaster-dev-call-frame.vercel.app/click" />
          </head>
          <body><marquee> wowow </marquee></body>
      </html>`);
    res.end();

    // GET /image
    // Return the image used in the image tag
  } else if (req.url === "/image") {
    const imagePath = path.join(__dirname, "frame-fc.png");
    const imageStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    imageStream.pipe(res);

    // POST /click
    // Handle the Frame Signature Packet response when a button is clicked
    // in the frame
  } else if (req.method === "POST" && req.url === "/click") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on("end", () => {
      // Get the index of the button that was clicked. Using untrusted data is
      // safe because we take the same action irrespective of who clicked it.
      const buttonIndex = JSON.parse(body).untrustedData.buttonIndex;

      // Route to another internal endpoint which does the redirect.
      res.writeHead(302, {
        Location:
          "https://farcaster-dev-call-frame.vercel.app/redirect?buttonIndex=" + buttonIndex,
      });

      res.end();
    });

    // GET /redirect
    // An endpoint which accepts a button index and 302's to the appropriate URL
    // This works around the same-origin policy that frames enforce for
    // post_redirects which is being fixed soon.
  } else if (req.method === "GET" && req.url.startsWith("/redirect")) {
    const queryObject = url.parse(req.url, true).query;
    const buttonIndex = queryObject.buttonIndex;

    let redirectUrl;

    if (buttonIndex === "1") {
      redirectUrl = SUPERRARE_LINK;
    } else if (buttonIndex === "2") {
      redirectUrl = OBJKT_LINK;
    } else if (buttonIndex === "3") {
      redirectUrl = TWITTER_LINK;
    } else if (buttonIndex === "4") {
      redirectUrl = FXHASH_LINK;
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Invalid button index");
    }

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } else {
    // Catchall 404 Route
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
