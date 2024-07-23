import express from "express";

import rest from "./rest/index";
import logger from "src/logger/logger";
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("", rest);


app.get("/", function (_req, res) {
  res.json({ data: "Read the README.md!" });
});


const createApp = (port = 3000) => {
  app.listen(port, function () {
    logger.info("Example app listening on port !")
    console.log("Example app listening on port !");
  });
  return app;
};

export default createApp;
