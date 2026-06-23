import OpenAI from "openai";
import _env from "./index";

export default new OpenAI({ apiKey: _env.OPENAI_API_KEY ?? "" });
