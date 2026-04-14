import { Badge } from "@/components/ui/Badge";

export function PlagiarismBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <Badge variant="pending">Тексерілуде</Badge>;
  }
  const pct = Math.round(score);
  const variant = pct < 15 ? "approved" : pct < 30 ? "pending" : "rejected";
  return (
    <Badge variant={variant} className="font-mono">
      {pct}% ұқсас
    </Badge>
  );
}
