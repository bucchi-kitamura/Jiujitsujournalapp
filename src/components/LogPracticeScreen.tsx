import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Save, User, ChevronRight, Target, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { PageHeader } from "./PageHeader";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { PracticeSession } from "../utils/types";

interface LogPracticeScreenProps {
  onBack: () => void;
  onSave?: (data: Omit<PracticeSession, "id">, id?: string) => void;
  onSelectLocation?: () => void;
  onSelectTechnique?: () => void;
  onSelectInstructor?: () => void;
  selectedLocation?: string;
  selectedTechnique?: string;
  selectedInstructor?: string;
  editingPractice?: PracticeSession;
}

export function LogPracticeScreen({ 
  onBack, 
  onSave,
  onSelectLocation,
  onSelectTechnique,
  onSelectInstructor,
  selectedLocation,
  selectedTechnique,
  selectedInstructor,
  editingPractice,
}: LogPracticeScreenProps) {
  const [date, setDate] = useState<Date | undefined>(
    editingPractice ? new Date(editingPractice.date) : new Date()
  );
  const [duration, setDuration] = useState<number>(editingPractice?.duration || 90);
  const [notes, setNotes] = useState(editingPractice?.notes || "");
  const [intensity] = useState(editingPractice?.intensity || 3); 

  const handleSave = () => {
    if (!date) {
      toast.error("日付を選択してください");
      return;
    }
    
    const practiceData: Omit<PracticeSession, "id"> = {
      date: date.toISOString(),
      duration,
      location: selectedLocation || editingPractice?.location || "未設定",
      notes,
      intensity,
      instructor: selectedInstructor || editingPractice?.instructor || undefined,
      techniques: selectedTechnique ? [selectedTechnique] : (editingPractice?.techniques || []),
      challenges: editingPractice?.challenges || []
    };

    console.log("Saving practice:", practiceData);
    
    if (onSave) {
      onSave(practiceData, editingPractice?.id);
    } else {
      onBack();
    }
  };

  const incrementDuration = () => {
    setDuration(prev => Math.min(prev + 15, 300));
  };

  const decrementDuration = () => {
    setDuration(prev => Math.max(prev - 15, 0));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader 
        title={editingPractice ? "練習を編集" : "練習を記録"}
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Basic Info Section - Date, Location, Duration */}
        <div className="space-y-3">
          <Label>基本情報</Label>
          
          {/* Date and Location in a row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Selection */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">日付</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MM/dd", { locale: ja }) : <span>選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">場所</span>
              <button
                onClick={onSelectLocation}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors h-12"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium truncate text-sm">
                    {selectedLocation || "選択"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">練習時間</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementDuration}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 flex items-center justify-center bg-accent/30 rounded-xl h-12">
                <span className="text-2xl font-semibold tabular-nums">{duration}</span>
                <span className="text-sm text-muted-foreground ml-2">分</span>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementDuration}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>15分単位で調整</span>
              <span>最大300分</span>
            </div>
          </div>
        </div>

        {/* Selection Items - Technique and Instructor */}
        <div className="space-y-2">
          <Label>選択項目</Label>
          <div className="grid grid-cols-2 gap-3">
            {/* Technique */}
            <button
              onClick={onSelectTechnique}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
            >
              <Target className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">技</span>
              {selectedTechnique && (
                <span className="text-sm font-medium text-center line-clamp-2 mt-1">
                  {selectedTechnique}
                </span>
              )}
            </button>

            {/* Instructor */}
            <button
              onClick={onSelectInstructor}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
            >
              <User className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">先生</span>
              {selectedInstructor && (
                <span className="text-sm font-medium text-center line-clamp-2 mt-1">
                  {selectedInstructor}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>メモ</Label>
          <Textarea 
            placeholder="練習内容や気付いたこと..." 
            className="min-h-[120px] resize-none text-base"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="h-20" /> {/* Spacer for bottom button */}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button onClick={handleSave} className="w-full h-12 text-base font-medium" size="lg">
          <Save className="w-4 h-4 mr-2" />
          保存する
        </Button>
      </div>
    </div>
  );
}
