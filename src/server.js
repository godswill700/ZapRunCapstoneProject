require("dotenv").config(); 


// Import the Express app 
const app = require("./app");
require("./config/env")();
// Define the port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`ZAPRun server running on port ${PORT}`);
});
