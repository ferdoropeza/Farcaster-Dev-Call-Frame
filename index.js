const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Links used for the redirect
const CALENDAR_LINK =
  "https://objkt.com/users/tz2JyW132finpXHFNCSrHtcBEHRmwp5ffYks";
const PLAYLIST_LINK =
  "https://www.fxhash.xyz/u/Daniel%20Oropeza";
const NOTION_LINK =
  "https://superrare.com/ferdoropeza";
const ZOOM_LINK =
  "https://twitter.com/ferdoropeza";

// Middleware to parse JSON body
app.use(express.json());

// GET / (Index Route)
app.get("/", (req, res) => {
  res.send(`
    <html>
       <head>   
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width"/>
          <meta property="og:title" content="FC Dev Call" />
          <meta property='og:image' content="https://fc-dev-call.replit.app/image" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://fc-dev-call.replit.app/image" />
          <meta property="fc:frame:button:1" content="Notes" />
          <meta property="fc:frame:button:1:action" content="post_redirect" />
          <meta property="fc:frame:button:2" content="Calendar" />
          <meta property="fc:frame:button:2:action" content="post_redirect" />
          <meta property="fc:frame:button:3" content="Zoom" />
          <meta property="fc:frame:button:3:action" content="post_redirect" />
          <meta property="fc:frame:button:4" content="Recordings" />
          <meta property="fc:frame:button:4:action" content="post_redirect" />
          <meta property="fc:frame:post_url" content="https://fc-dev-call.replit.app/click" />
        </head>
        <body><marquee behavior="scroll" direction="left">wowow!</marquee></body>
    </html>
    `);
});

// GET /image
// Return the image used in the image tag
app.get("/image", (req, res) => {
  const imagePath = path.join(__dirname, "frame-fc.png");
  res.sendFile(imagePath);
});

// POST /click
// Callback which handles the button click event. Unpacks the Frame Signature
// packet to extract the button clicked and forwards it to /redirect. Using
// untrusted data is safe because we take the same action irrespective if who
// clicked the frame button.
app.post("/click", (req, res) => {
  const buttonIndex = req.body.untrustedData.buttonIndex;
  console.log("0");
  res.redirect(`/redirect?buttonIndex=${buttonIndex}`);
});

// GET /redirect
// Redirects to an external URL based on buttonIndex parameter. Used to work
// around the same origin policy  on frames, which is being removed soon.
app.get("/redirect", (req, res) => {
  console.log("1");
  const buttonIndex = req.query.buttonIndex;
  let redirectUrl;

  switch (buttonIndex) {
    case "1":
      console.log("2b");
      redirectUrl = NOTION_LINK;
      break;
    case "2":
      redirectUrl = CALENDAR_LINK;
      break;
    case "3":
      redirectUrl = ZOOM_LINK;
      break;
    case "4":
      redirectUrl = PLAYLIST_LINK;
      break;
    default:
      console.log("2a");
      return res.status(404).send("Invalid button index");
  }

  res.redirect(redirectUrl);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
