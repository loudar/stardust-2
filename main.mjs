import express from "express";
import path from "path";

const app = express();
const port = 3333;
const dirname = path.resolve();

app.use(express.static(path.join(dirname, "public")));

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
