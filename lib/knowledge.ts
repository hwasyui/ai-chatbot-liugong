import faqData from "@/data/company_faq.json";

type QAPair = { question: string; answer: string };
type Category = { category: string; qa_pairs: QAPair[] };
type FaqFile = { company_name: string; knowledge_base: Category[] };

const faq: FaqFile = faqData;

export function getKnowledgeText(): string {
  const sections = faq.knowledge_base.map((cat) => {
    const lines = cat.qa_pairs.map((pair) => `Q: ${pair.question}\nA: ${pair.answer}`);
    return `## ${cat.category}\n${lines.join("\n\n")}`;
  });

  return `company: ${faq.company_name}\n\n${sections.join("\n\n")}`;
}

export function getSuggestedQuestions(count = 4): string[] {
  const ordered: string[] = [];
  const longestCategory = Math.max(0, ...faq.knowledge_base.map((cat) => cat.qa_pairs.length));

  for (let round = 0; round < longestCategory; round++) {
    for (const cat of faq.knowledge_base) {
      const pair = cat.qa_pairs[round];
      if (pair) ordered.push(pair.question);
    }
  }

  return ordered.slice(0, count);
}
