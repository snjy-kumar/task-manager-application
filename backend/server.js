import app from "./app.js";
import environment from "./src/config/environment.js";

 
app.listen(environment.port, () => {
    console.log(`Server is running on port https://localhost:${environment.port}`);
})