import app from "./app.js";
import cloudinary from "cloudinary";

// Load environment variables
if (!process.env.PORT) {
    console.error("PORT environment variable is not set");
    process.exit(1);
}

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on port ${process.env.PORT}`);
    console.log(`📍 Health check: http://localhost:${process.env.PORT}/api/v1/health`);
});


