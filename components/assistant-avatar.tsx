import { MessageCircle } from "lucide-react";

type AssistantAvatarProps = { size?: "md" | "lg" };

export default function AssistantAvatar({ size = "md" }: AssistantAvatarProps) {
  const boxSize = size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white ${boxSize}`}
    >
      <MessageCircle className="h-1/2 w-1/2" />
    </div>
  );
}
