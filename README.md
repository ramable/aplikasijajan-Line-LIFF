# JajanKuy LIFF App
 This is a food web application that use the basic functionality of the [LINE Front-End Framework (LIFF v2).](https://developers.line.biz/en/docs/liff/overview/)
 
 ### Prerequisite
 To start developing this app, we must first create [a provider and a channel](https://developers.line.biz/en/docs/liff/getting-started/) on the [LINE Developers Console](https://developers.line.biz/console) to get a channel access token.
 
 ### Deploy
 * [Heroku](https://www.heroku.com/)

To get more information about deployment method, please check the documentation about [using Heroku CLI.](https://devcenter.heroku.com/articles/git)
 
 ### Running the app
 1. Create the app URL https://aplikasijajan.herokuapp.com from Heroku Account.
 2. Add the app URL to LIFF Endpoint URL. Please take a look at [How to adding a LIFF app.](https://developers.line.biz/en/docs/liff/registering-liff-apps/#registering-liff-app)
 3. Set the `LIFF ID` to liff-starter.js. Please refer to the [API Reference Page](https://developers.line.biz/en/reference/liff/#initialize-liff-app) for initializes the app.
 4. Open the LIFF URL in the LINE app or external browser.
 
 ### Opening the LIFF app
 To open the LIFF app within the LINE app, follow the steps below:
 1. Enter the LIFF URL `https://liff.line.me/{liffId}` on the LINE chat screen. `{liffId}` was created when adding the LIFF app.
 2. Tap the LIFF URL displayed in the bubble to open the LIFF app.
 3. Agree to grant the required permissions to the LIFF app.

For more information please check this [official documentation.](https://developers.line.biz/en/docs/liff/opening-liff-app/)
