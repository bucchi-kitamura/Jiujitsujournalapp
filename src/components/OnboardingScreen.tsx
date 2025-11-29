import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";

interface OnboardingScreenProps {
  onSubmit: (data: { name: string; beltRank: string }) => void;
  initialName?: string;
}

const BELT_RANKS = [
  { id: "white", label: "白帯", color: "bg-white border-slate-200 text-slate-900" },
  { id: "blue", label: "青帯", color: "bg-blue-600 border-blue-600 text-white" },
  { id: "purple", label: "紫帯", color: "bg-purple-600 border-purple-600 text-white" },
  { id: "brown", label: "茶帯", color: "bg-amber-800 border-amber-800 text-white" },
  { id: "black", label: "黒帯", color: "bg-slate-900 border-slate-900 text-white" },
];

export function OnboardingScreen({ onSubmit, initialName = "" }: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(initialName);
  const [beltRank, setBeltRank] = useState("white");

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2) {
      onSubmit({ name, beltRank });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: step === 1 ? "50%" : "100%" }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
        <div className="space-y-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Step {step} of 2
          </motion.p>
          <motion.h1 
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            {step === 1 ? "あなたの名前は？" : "現在の帯色は？"}
          </motion.h1>
          <motion.p 
            key={`desc-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground"
          >
            {step === 1 
              ? "プロフィールに表示される名前を入力してください。" 
              : "練習記録や課題の提案に使用されます。"}
          </motion.p>
        </div>

        <div className="flex-1">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="sr-only">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg py-6"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <RadioGroup value={beltRank} onValueChange={setBeltRank} className="gap-3">
                {BELT_RANKS.map((rank) => (
                  <div key={rank.id}>
                    <RadioGroupItem value={rank.id} id={rank.id} className="peer sr-only" />
                    <Label
                      htmlFor={rank.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-secondary/50 peer-data-[state=checked]:border-primary ${
                        beltRank === rank.id ? "ring-2 ring-primary ring-offset-2" : "border-transparent bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border ${rank.color}`} />
                        <span className="font-medium text-base">{rank.label}</span>
                      </div>
                      {beltRank === rank.id && <Check className="w-5 h-5 text-primary" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          {step === 2 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1 h-14 text-base"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className="flex-1 h-14 text-base font-semibold"
          >
            {step === 1 ? "次へ" : "始める"}
            {step === 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
