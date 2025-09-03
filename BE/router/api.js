import { Router } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.get("/", (req, res) => {
  res.json({
    message: "working perfectly",
  });
});

router.post(
  "/try-on",
  upload.fields([
    { name: "person", maxCount: 1 },
    { name: "product", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Check if files were uploaded
      if (!req.files || !req.files.person || !req.files.product) {
        return res.status(400).json({
          error: "Both person and product images are required",
        });
      }
      const personFile = req.files.person[0];
      const productFile = req.files.product[0];

      // Read the uploaded files
      const personBuffer = fs.readFileSync(personFile.path);
      const productBuffer = fs.readFileSync(productFile.path);

      // Convert to base64
      const base64ImagePerson = personBuffer.toString("base64");
      const base64ImageProduct = productBuffer.toString("base64");

      // Create the prompt for image combination
      const prompt1 = [
        {
          text: `Using all the photos of the person provided first as reference, have them wear the outfit from the next image. Place them in a simple, photorealistic studio setting.`,
        },
        {
          inlineData: {
            mimeType: personFile.mimetype,
            data: base64ImagePerson,
          },
        },
        {
          inlineData: {
            mimeType: productFile.mimetype,
            data: base64ImageProduct,
          },
        },
      ];
      // Generate content
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: {
          parts: [...prompt1],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      // Clean up uploaded files
      fs.unlinkSync(personFile.path);
      fs.unlinkSync(productFile.path);

      // Extract the generated image from response
      let imageUrl = null;
      let text = "";

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            console.log(part.text);
            text += part.text;
          } else if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            fs.writeFileSync("gemini-native-image.png", imageUrl);
            console.log("Image saved as gemini-native-image.png");
          }
        }
      }

      if (!imageUrl) {
        return res.status(500).json({
          error: "Failed to generate combined image",
        });
      }

      // Return the generated image
      res.json({
        image: imageUrl,
        message: text,
      });
    } catch (error) {
      console.error("Image composition error:", error);

      // Clean up uploaded files in case of error
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
      }

      res.status(500).json({
        error: "Image composition failed",
        details: error.message,
      });
    }
  }
);

export default router;
