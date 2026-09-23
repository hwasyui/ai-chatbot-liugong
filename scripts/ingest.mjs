// one-time script: embeds every faq entry and upserts it into supabase, run manually via npm run ingest
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMBEDDING_DIMENSIONS = 768;
const TABLE = "liugong_rag_faq_chunks";

// reads one env var, throws early if its missing instead of failing weirdly later
function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set (see README)`);
  return value;
}

// turns a category/question into a stable id example: "Leave & Time Off" -> "leave-time-off"
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const faqPath = path.join(__dirname, "..", "data", "company_faq.json");
const faq = JSON.parse(readFileSync(faqPath, "utf-8"));

const ai = new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") });
const embeddingModel = requireEnv("GEMINI_EMBEDDING_MODEL");
const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_KEY"));

const rows = [];
for (const category of faq.knowledge_base) {
  for (const pair of category.qa_pairs) {
    rows.push({
      chunk_key: `${slugify(category.category)}--${slugify(pair.question)}`,
      category: category.category,
      question: pair.question,
      answer: pair.answer,
      content: `Category: ${category.category}\nQ: ${pair.question}\nA: ${pair.answer}`,
    });
  }
}

console.log(`embedding ${rows.length} FAQ chunks with ${embeddingModel}...`);

for (const row of rows) {
  const response = await ai.models.embedContent({
    model: embeddingModel,
    contents: [row.content],
    config: { taskType: "RETRIEVAL_DOCUMENT", outputDimensionality: EMBEDDING_DIMENSIONS },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) throw new Error(`empty embedding for chunk: ${row.chunk_key}`);

  row.embedding = values;
  console.log(`  embedded: ${row.chunk_key}`);
}

const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "chunk_key" });
if (error) throw new Error(`upsert failed: ${error.message}`);

console.log(`done. upserted ${rows.length} chunks into ${TABLE}.`);
