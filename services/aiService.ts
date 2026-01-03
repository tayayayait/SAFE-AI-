export interface AIAnalysisResult {
  overview: string;
  legalBasis: string;
  penalty: string;
  prevention: string;
  checklist: string[];
  cause: string;
  title: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

const OPENAI_MODEL = "gpt-4o-mini";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const VISION_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";

const ANALYSIS_SCHEMA = {
  name: "disaster_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", description: "Short incident title." },
      overview: { type: "string", description: "Incident summary." },
      cause: { type: "string", description: "Root cause analysis." },
      legalBasis: { type: "string", description: "Relevant legal basis." },
      penalty: { type: "string", description: "Penalty or sanctions." },
      prevention: { type: "string", description: "Prevention measures." },
      checklist: {
        type: "array",
        items: { type: "string" },
        description: "On-site checklist items."
      }
    },
    required: ["title", "overview", "cause", "legalBasis", "penalty", "prevention", "checklist"]
  }
};

const ensureOpenAIKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }
};

const ensureVisionKey = () => {
  if (!GOOGLE_VISION_API_KEY) {
    throw new Error("GOOGLE_VISION_API_KEY is not set.");
  }
};

const parseJson = (payload: string): AIAnalysisResult => {
  try {
    return JSON.parse(payload) as AIAnalysisResult;
  } catch (error) {
    console.error("Failed to parse AI response:", payload);
    throw error;
  }
};

const analyzeTextWithOpenAI = async (text: string): Promise<AIAnalysisResult> => {
  ensureOpenAIKey();

  const systemPrompt = [
    "You are an industrial safety compliance expert.",
    "Analyze the provided incident text and return a structured report.",
    "Output must match the JSON schema exactly.",
    "Write all field values in Korean."
  ].join(" ");

  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Incident text:\n${text}` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: ANALYSIS_SCHEMA
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content.");
  }

  return parseJson(content);
};

const extractTextFromImage = async (imageBase64: string): Promise<string> => {
  ensureVisionKey();

  const response = await fetch(`${VISION_ENDPOINT}?key=${GOOGLE_VISION_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          imageContext: { languageHints: ["ko"] }
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Vision API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const apiError = data?.responses?.[0]?.error?.message;
  if (apiError) {
    throw new Error(`Vision API error: ${apiError}`);
  }

  const ocrText =
    data?.responses?.[0]?.fullTextAnnotation?.text ||
    data?.responses?.[0]?.textAnnotations?.[0]?.description ||
    "";

  if (!ocrText.trim()) {
    throw new Error("No text detected in image.");
  }

  return ocrText;
};

export const analyzeDisasterText = async (text: string): Promise<AIAnalysisResult> => {
  if (!text?.trim()) {
    throw new Error("Text input is empty.");
  }

  return analyzeTextWithOpenAI(text);
};

export const analyzeDisasterImage = async (input: {
  imageBase64: string;
  mimeType?: string;
}): Promise<{ analysis: AIAnalysisResult; ocrText: string }> => {
  if (!input.imageBase64) {
    throw new Error("Image input is empty.");
  }

  const ocrText = await extractTextFromImage(input.imageBase64);
  const analysis = await analyzeTextWithOpenAI(ocrText);

  return { analysis, ocrText };
};
