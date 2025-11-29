import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Save, User, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { PracticeSession } from "../utils/types";

interface LogPracticeScreenProps {
  onBack: () => void;
  onSave?: (data: Omit<PracticeSession, "id">) => void;
  availableInstructors?: string[];
}

export function LogPracticeScreen({ onBack, onSave, availableInstructors = [] }: LogPracticeScreenProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState<number>(90);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  // Hidden field, default to 3
  const [intensity] = useState(3); 
  
  const [instructor, setInstructor] = useState("");
  const [instructorOpen, setInstructorOpen] = useState(false);

  const handleSave = () => {
    if (!date) {
      toast.error("日付を選択してください");
      return;
    }
    
    const practiceData: Omit<PracticeSession, "id"> = {
      date: date.toISOString(),
      duration,
      location: location || "未設定",
      notes,
      intensity, // Default value
      instructor: instructor || undefined,
      techniques: [], // Cleared as requested
      challenges: [] 
    };

    console.log("Saving practice:", practiceData);
    
    if (onSave) {
      onSave(practiceData);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader 
        title="練習を記録"
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>日付</Label>
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
                {date ? format(date, "yyyy年MM月dd日 (EEE)", { locale: ja }) : <span>日付を選択</span>}
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

        {/* Duration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>練習時間</Label>
            <span className="text-xl font-medium font-mono">{duration} <span className="text-sm text-muted-foreground font-sans">分</span></span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={(vals) => setDuration(vals[0])}
            max={180}
            step={15}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>0分</span>
            <span>90分</span>
            <span>180分</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>場所</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="道場名や場所を入力" 
              className="pl-9 h-12"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-2">
          <Label>先生（インストラクター）</Label>
          <div className="flex gap-2">
            <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={instructorOpen}
                  className="w-full justify-between h-12"
                >
                  {instructor ? (
                    <div className="flex items-center">
                       <User className="mr-2 h-4 w-4 opacity-50" />
                       {instructor}
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                       <User className="mr-2 h-4 w-4 opacity-50" />
                       先生を選択または入力
                    </div>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="先生の名前を入力..." 
                    onValueChange={(value) => {
                       // This allows typing new names directly if not found in list
                       // But CommandInput doesn't directly expose value state easily for external binding in standard implementation
                       // We will use the empty state to allow adding new
                    }}
                  />
                  <CommandList>
                    <CommandEmpty className="py-2 px-4">
                       <p className="text-sm text-muted-foreground mb-2">見つかりませんか？</p>
                       <Button 
                         variant="secondary" 
                         size="sm" 
                         className="w-full"
                         onClick={() => {
                           // We can't easily get the input value from CommandInput here without controlled state on Command
                           // So we might need a different approach or assume the user will type in a separate input if not found
                           // Let's just simply change this UI to be "Select from history" OR "Type new"
                           setInstructorOpen(false);
                           toast.info("リストにない場合は直接入力してください");
                         }}
                       >
                         手動で入力する
                       </Button>
                    </CommandEmpty>
                    <CommandGroup heading="履歴">
                      {availableInstructors.map((inst) => (
                        <CommandItem
                          key={inst}
                          value={inst}
                          onSelect={(currentValue) => {
                            setInstructor(currentValue);
                            setInstructorOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              instructor === inst ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {inst}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Fallback / Direct Input */}
          <div className="relative mt-2">
             <Input 
                placeholder="新しい先生の名前を入力" 
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className={cn("h-12", instructor ? "border-primary" : "")}
             />
             <p className="text-xs text-muted-foreground mt-1">
               ※ 上記のリストから選択するか、直接入力してください
             </p>
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
