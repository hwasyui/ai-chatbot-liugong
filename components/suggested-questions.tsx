type SuggestedQuestionsProps = { questions: string[]; onPick: (question: string) => void; disabled: boolean };

export default function SuggestedQuestions({ questions, onPick, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onPick(question)}
          disabled={disabled}
          className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
