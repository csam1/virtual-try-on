# AI Image Combiner

A full-stack application that combines person and product images using Google's Gemini AI to create professional fashion photos.

## Features

- Upload person and product images
- AI-powered image combination using Gemini
- Modern, responsive UI
- Real-time image preview
- Download combined results

## Project Structure

```
image-gen-ai/
├── BE/                 # Backend (Node.js/Express)
│   ├── index.js        # Main server file
│   ├── package.json    # Backend dependencies
│   └── uploads/        # Temporary file storage
├── FE/                 # Frontend (React/TypeScript)
    ├── src/
    │   ├── App.tsx     # Main React component
    │   └── App.css     # Styling
    └── package.json    # Frontend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd BE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the BE directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. Get your Gemini API key


5. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. Open the frontend application in your browser
2. Upload a person image (the model/wearer)
3. Upload a product image (the clothing item)
4. Click "Combine Images" to generate the AI-combined result
5. Download the final image

## API Endpoints

### POST `/api/try-on`

Combines person and product images using Gemini AI.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `person`: Person image file
  - `product`: Product image file

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "message": "Images combined successfully"
}
```

## Technologies Used

### Backend
- Node.js
- Express.js
- Multer (file upload handling)
- Google Generative AI (Gemini)
- CORS

### Frontend
- React
- TypeScript
- Vite
- CSS3 (modern styling)

## Notes

- The application uses Gemini 1.5 Flash model for image generation
- Uploaded files are temporarily stored and automatically cleaned up
- Maximum file size: 10MB per image
- Supported formats: All common image formats (PNG, JPG, JPEG, etc.)

## Troubleshooting

1. **CORS errors**: Ensure the backend is running on port 3000
2. **API key errors**: Verify your Gemini API key is correct and has proper permissions
3. **File upload errors**: Check that files are valid images and under 10MB
4. **Generation failures**: The AI model may occasionally fail to generate images - try again with different images

## License

MIT License
