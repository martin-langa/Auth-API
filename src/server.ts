import app from "./app.js";
import { env } from "./util/env.js";

const PORT = env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});