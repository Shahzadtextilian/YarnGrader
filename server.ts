import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limits for base64 file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Scanning feature will be unavailable.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "PLACEHOLDER",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint: AI OCR Scanner for Uster Report documents/images
app.post("/api/scan-report", async (req, res) => {
  try {
    const { fileData, mimeType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "No file data provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Scanning service is recovering. Please configure your GEMINI_API_KEY in Settings > Secrets.",
      });
    }

    const ai = getAi();

    const filePart = {
      inlineData: {
        mimeType: mimeType || "image/png",
        data: fileData,
      },
    };

    const promptText = `
      Analyze this Uster Tester yarn test report (it could be an image or a PDF/text block).
      Extract the core yarn variables and all measured parameters. Use the instructions below.

      1. Yarn count (Ne / English cotton count). Match it as a number decimal (e.g. 30.0, 20.0, 40.0, etc.). Note: Ne is generally designated by the letter 'Ne' or 'count' or 'English count'.
      2. Yarn Type: Decide if the yarn is Combed (compact/compacted/combed yarn) or Carded (carded ring/carded yarn). Look for terms like 'Carded', 'Combed', 'Compact', 'Ring yarn'.
      3. Quality Parameters: Find any of the following measured numbers:
         - Mass Variation: CVm [%]
         - CVm 1m [%] (Coefficient of variation of mass 1m)
         - CVm 3m [%] (Coefficient of variation of mass 3m)
         - CVb CVm [%] (Coefficient of variation of mass, between)
         - Thin -40% (/km) or "Thin places -40%"
         - Thin -50% (/km) or "Thin places -50%"
         - Thick +35% (/km) or "Thick places +35%"
         - Thick +50% (/km) or "Thick places +50%"
         - Neps +140% (/km)
         - Neps +200% (/km)
         - H (Hairiness index)
         - sH (Standard deviation of hairiness)
         - S3u (Hairiness Sum > 3mm)
         - Dst Cnt (Dust count /km)
         - Tr Cnt (Trash count /km)

      Match each parameter to its exact key:
      - "CVm"
      - "CVm_1m"
      - "CVm_3m"
      - "CVb_CVm"
      - "Thin_40"
      - "Thin_50"
      - "Thick_35"
      - "Thick_50"
      - "Neps_140"
      - "Neps_200"
      - "H"
      - "sH"
      - "S3u"
      - "Dst_Cnt"
      - "Tr_Cnt"

      If a parameter is not present, omit it from the parameters array. Make sure the measurements are correct from the text!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [filePart, promptText],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["yarnType", "ne", "parameters"],
          properties: {
            yarnType: {
              type: Type.STRING,
              description: "Must be exactly 'carded' or 'combed'.",
            },
            ne: {
              type: Type.NUMBER,
              description: "The count of the yarn as a floating point value.",
            },
            parameters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["key", "measured", "originalName"],
                properties: {
                  key: {
                    type: Type.STRING,
                    description: "The strict matched standard key name from the list.",
                  },
                  measured: {
                    type: Type.NUMBER,
                    description: "The actual measured value reported.",
                  },
                  originalName: {
                    type: Type.STRING,
                    description: "The raw spelling in the report.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Scanning Error:", err);
    res.status(500).json({ error: "Failed to scan report: " + err.message });
  }
});

// REST API endpoint: Gemini Parser for plain OCR text
app.post("/api/parse-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Gemini server parsing is offline. Falling back to browser parser.",
      });
    }

    const ai = getAi();

    const promptText = `
      Analyze this Optical Character Recognition (OCR) text extracted from an Uster Tester yarn test report.
      Extract the core yarn variables and all measured parameters. Use the instructions below.

      1. Yarn count (Ne / English cotton count). Match it as a number decimal (e.g. 30.0, 20.0, 40.0, etc.). Note: Ne is generally designated by the letter 'Ne' or 'count' or 'English count'.
      2. Yarn Type: Decide if the yarn is Combed (compact/compacted/combed yarn) or Carded (carded ring/carded yarn). Look for terms like 'Carded', 'Combed', 'Compact', 'Ring yarn'.
      3. Quality Parameters: Find any of the following measured numbers:
         - Mass Variation: CVm [%]
         - CVm 1m [%] (Coefficient of variation of mass 1m)
         - CVm 3m [%] (Coefficient of variation of mass 3m)
         - CVb CVm [%] (Coefficient of variation of mass, between)
         - Thin -40% (/km) or "Thin places -40%"
         - Thin -50% (/km) or "Thin places -50%"
         - Thick +35% (/km) or "Thick places +35%"
         - Thick +50% (/km) or "Thick places +50%"
         - Neps +140% (/km)
         - Neps +200% (/km)
         - H (Hairiness index)
         - sH (Standard deviation of hairiness)
         - S3u (Hairiness Sum > 3mm)
         - Dst Cnt (Dust count /km)
         - Tr Cnt (Trash count /km)

      Match each parameter to its exact key:
      - "CVm"
      - "CVm_1m"
      - "CVm_3m"
      - "CVb_CVm"
      - "Thin_40"
      - "Thin_50"
      - "Thick_35"
      - "Thick_50"
      - "Neps_140"
      - "Neps_200"
      - "H"
      - "sH"
      - "S3u"
      - "Dst_Cnt"
      - "Tr_Cnt"

      If a parameter is not present, omit it from the parameters array. Make sure the measurements are correct from the text!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `Extracted OCR Text:\n${text}` },
        promptText
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["yarnType", "ne", "parameters"],
          properties: {
            yarnType: {
              type: Type.STRING,
              description: "Must be exactly 'carded' or 'combed'.",
            },
            ne: {
              type: Type.NUMBER,
              description: "The count of the yarn as a floating point value.",
            },
            parameters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["key", "measured", "originalName"],
                properties: {
                  key: {
                    type: Type.STRING,
                    description: "The strict matched standard key name from the list.",
                  },
                  measured: {
                    type: Type.NUMBER,
                    description: "The actual measured value reported.",
                  },
                  originalName: {
                    type: Type.STRING,
                    description: "The raw spelling in the report.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const parsedText = response.text || "{}";
    res.json(JSON.parse(parsedText));
  } catch (err: any) {
    console.error("Parsing Error:", err);
    res.status(500).json({ error: "Failed to parse text: " + err.message });
  }
});

// Serve compiled web assets
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // In dev mode, mount Vite HMR middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Uster Yarn Grader server listening on port ${PORT}`);
  });
}

initServer().catch((e) => {
  console.error("Server boot failure:", e);
});
