import { getSupabaseClient } from "@/lib/supabase";
import type { FaqChunk } from "@/lib/types";

const MATCH_COUNT = 5;
const MATCH_THRESHOLD = 0.3;

// finds the faq chunks whose vectors are closest to the given query vector
export async function searchFaq(queryEmbedding: number[]): Promise<FaqChunk[]> {
  const { data, error } = await getSupabaseClient().rpc("match_liugong_rag_faq_chunks", {
    query_embedding: queryEmbedding,
    match_count: MATCH_COUNT,
    match_threshold: MATCH_THRESHOLD,
  });

  if (error) throw new Error(`failed to search faq: ${error.message}`);

  return (data ?? []) as FaqChunk[];
}
