import { Check } from "lucide-react";

export function StepIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Файл" },
    { n: 2, label: "Мәліметтер" },
    { n: 3, label: "Тексеру" },
  ];
  return (
    <div className="flex items-center justify-center mb-16">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-2 relative">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s.n ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {step > s.n ? <Check size={20} /> : s.n}
            </div>
            <span
              className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${
                step >= s.n ? "text-primary" : "text-neutral-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <div className={`h-0.5 w-24 mx-4 transition-all ${step > s.n ? "bg-primary" : "bg-neutral-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
