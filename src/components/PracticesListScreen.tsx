import { ArrowLeft, Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./PageHeader";
import { PracticeSession } from "../utils/types";
import { cn } from "./ui/utils";

interface PracticesListScreenProps {
  practices: PracticeSession[];
  onBack: () => void;
  onPracticeClick: (id: string) => void;
}

export function PracticesListScreen({ 
  practices, 
  onBack,
  onPracticeClick 
}: PracticesListScreenProps) {
  const sortedPractices = [...practices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by month
  const groupedPractices = sortedPractices.reduce((groups, practice) => {
    const date = new Date(practice.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(practice);
    return groups;
  }, {} as Record<string, PracticeSession[]>);

  const monthKeys = Object.keys(groupedPractices).sort().reverse();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader 
        title="練習履歴"
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      <div className="flex-1 p-4 space-y-6">
        {practices.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>まだ練習記録がありません</p>
          </div>
        ) : (
          monthKeys.map((monthKey) => {
            const [year, month] = monthKey.split('-');
            const monthLabel = `${year}年${parseInt(month)}月`;
            
            return (
              <div key={monthKey}>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">{monthLabel}</h2>
                <div className="space-y-3">
                  {groupedPractices[monthKey].map((practice) => (
                    <div 
                      key={practice.id}
                      onClick={() => onPracticeClick(practice.id)}
                      className="bg-card border border-border rounded-xl p-4 active:scale-[0.99] transition-transform cursor-pointer hover:border-primary/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center gap-2">
                          <span className="text-lg">
                            {new Date(practice.date).getDate()}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({new Date(practice.date).toLocaleDateString("ja-JP", { weekday: "short" })})
                            </span>
                          </span>
                          {practice.duration > 0 && (
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                              {practice.duration}分
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{practice.location}</span>
                        </div>
                        
                        {practice.techniques && practice.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {practice.techniques.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-xs bg-accent/50 text-accent-foreground px-2 py-0.5 rounded-md">
                                {tech}
                              </span>
                            ))}
                            {practice.techniques.length > 3 && (
                              <span className="text-xs text-muted-foreground px-1">
                                +{practice.techniques.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
