import { GoogleGenAI } from "@google/genai";
import _env from "./index";

export default new GoogleGenAI({ apiKey: _env.GEMINI_API_KEY ?? "" });
