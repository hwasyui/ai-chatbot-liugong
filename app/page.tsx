import Chat from "@/components/chat";
import { getSuggestedQuestions } from "@/lib/knowledge";

export default function Home() {
  const suggestedQuestions = getSuggestedQuestions();

  return <Chat suggestedQuestions={suggestedQuestions} />;
}
