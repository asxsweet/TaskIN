import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, RotateCcw, X, ChevronRight, ChevronLeft, Send, AlertCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { StarRating } from "./StarRating";
import { ScoreRing } from "./ScoreRing";
import { cn } from "@/src/lib/utils";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: {
    title: string;
    author: string;
  };
  onSubmit: (data: any) => void;
}

export function ReviewFormModal({ isOpen, onClose, work, onSubmit }: ReviewFormModalProps) {
  const [step, setStep] = React.useState(1);
  const [scores, setScores] = React.useState<Record<string, number>>({
    "Өзектілік": 0,
    "Әдістеме": 0,
    "Ресімдеу": 0,
    "Қорытынды": 0,
  });
  const [reviews, setReviews] = React.useState({
    strengths: "",
    improvements: "",
    overall: "",
  });
  const [decision, setDecision] = React.useState<"approve" | "return" | "reject" | null>(null);
  const [returnReason, setReturnReason] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);

  const criteria = Object.keys(scores);
  const averageScore = criteria.reduce((acc, c) => acc + scores[c], 0) / criteria.length;
  const isStep1Complete = criteria.every(c => scores[c] > 0);
  const isStep2Complete = reviews.strengths.trim() !== "" && reviews.improvements.trim() !== "" && reviews.overall.trim() !== "";

  const handleNext = () => {
    if (step === 1 && isStep1Complete) setStep(2);
    else if (step === 2 && isStep2Complete) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!decision) {
      setErrors(["Шешім қабылдау қажет"]);
      return;
    }
    if (decision === "return" && !returnReason.trim()) {
      setErrors(["Қайтару себебін көрсетіңіз"]);
      return;
    }
    onSubmit({ scores, reviews, decision, returnReason, averageScore });
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              step >= s ? "bg-primary" : "bg-neutral-200"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              step === s ? "text-primary" : "text-neutral-400"
            )}>
              {s === 1 ? "Критерийлер" : s === 2 ? "Пікір" : "Қорытынды"}
            </span>
          </div>
          {s < 3 && <div className={cn("h-px w-12", step > s ? "bg-primary" : "bg-neutral-200")} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Академиялық бағалау" className="max-w-[480px]">
      <div className="p-6">
        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <h3 className="text-sm font-medium text-neutral-900 line-clamp-1">{work.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{work.author}</p>
              </div>

              <div className="space-y-5">
                {criteria.map((c) => (
                  <div key={c} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">{c}</span>
                    <StarRating 
                      rating={scores[c]} 
                      variant="interactive" 
                      size="lg" 
                      onRatingChange={(val) => setScores(prev => ({ ...prev, [c]: val }))}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-neutral-100 flex flex-col items-center gap-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Орташа баға</span>
                <ScoreRing score={averageScore} size={80} />
                <div className="text-center">
                  <span className="font-display text-3xl text-neutral-900">{averageScore.toFixed(2)}</span>
                  <span className="text-sm text-neutral-400 ml-1">/ 5.00</span>
                </div>
              </div>

              <Button 
                className="w-full h-12 gap-2" 
                disabled={!isStep1Complete}
                onClick={handleNext}
              >
                Жалғастыру <ChevronRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Жұмыстың күшті жақтары</label>
                <textarea
                  className="w-full rounded-lg border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                  placeholder="Негізгі жетістіктерді атаңыз..."
                  value={reviews.strengths}
                  onChange={(e) => setReviews(prev => ({ ...prev, strengths: e.target.value }))}
                />
                <div className="flex justify-end">
                  <span className="text-[10px] text-neutral-400">{reviews.strengths.length}/500</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Жақсарту ұсыныстары</label>
                <textarea
                  className="w-full rounded-lg border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                  placeholder="Нақты ұсыныстарыңызды жазыңыз..."
                  value={reviews.improvements}
                  onChange={(e) => setReviews(prev => ({ ...prev, improvements: e.target.value }))}
                />
                <div className="flex justify-end">
                  <span className="text-[10px] text-neutral-400">{reviews.improvements.length}/500</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Жалпы баға</label>
                <textarea
                  className="w-full rounded-lg border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-20"
                  placeholder="Қорытынды пікір..."
                  value={reviews.overall}
                  onChange={(e) => setReviews(prev => ({ ...prev, overall: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1 h-12" onClick={handleBack}>
                  <ChevronLeft size={18} className="mr-2" /> Артқа
                </Button>
                <Button 
                  className="flex-[2] h-12" 
                  disabled={!isStep2Complete}
                  onClick={handleNext}
                >
                  Жалғастыру <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 flex gap-4">
                <ScoreRing score={averageScore} size={60} />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {criteria.map(c => (
                      <div key={c} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-500">{c}:</span>
                        <span className="text-[10px] font-bold text-neutral-900">{scores[c]}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-2 line-clamp-2 italic">
                    "{reviews.overall}"
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">Шешім қабылдау</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "approve", label: "Бекіту", icon: Check, color: "teal", desc: "Жұмыс қабылданды" },
                    { id: "return", label: "Қайта жіберу", icon: RotateCcw, color: "amber", desc: "Өңдеу қажет" },
                    { id: "reject", label: "Қабылдамау", icon: X, color: "red", desc: "Жұмыс жарамсыз" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDecision(item.id as any)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-center",
                        decision === item.id 
                          ? `bg-${item.color}-tint border-${item.color === "teal" ? "success" : item.color === "amber" ? "warning" : "danger"}`
                          : "bg-white border-neutral-100 hover:border-neutral-200"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        decision === item.id ? `bg-white text-${item.color === "teal" ? "success" : item.color === "amber" ? "warning" : "danger"}` : "bg-neutral-50 text-neutral-400"
                      )}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-neutral-900">{item.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {decision === "return" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-neutral-700">Қайтару себебі *</label>
                  <textarea
                    className="w-full rounded-lg border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                    placeholder="Студентке нақты нұсқаулықтар жазыңыз..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  />
                </motion.div>
              )}

              {errors.length > 0 && (
                <div className="bg-danger-tint p-3 rounded-lg flex items-center gap-2 text-xs text-danger font-medium">
                  <AlertCircle size={14} /> {errors[0]}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1 h-12" onClick={handleBack}>
                  Артқа
                </Button>
                <Button 
                  className="flex-[2] h-12 gap-2" 
                  onClick={handleSubmit}
                >
                  Бағалауды жіберу <Send size={18} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
