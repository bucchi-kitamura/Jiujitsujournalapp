import { useState } from "react";
import { ArrowLeft, Plus, Target, CheckCircle2, Circle, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { PageHeader } from "./PageHeader";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Challenge } from "../utils/types";

interface ChallengesScreenProps {
  challenges: Challenge[];
  onBack: () => void;
  onAddChallenge: (data: { title: string; description: string }) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ChallengesScreen({ 
  challenges, 
  onBack, 
  onAddChallenge,
  onToggleStatus,
  onDelete 
}: ChallengesScreenProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status === "completed");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddChallenge({
      title: newTitle,
      description: newDescription
    });
    setNewTitle("");
    setNewDescription("");
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader 
        title="課題リスト"
        icon={Target}
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      <div className="flex-1 p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">取り組み中</TabsTrigger>
            <TabsTrigger value="completed">完了</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>現在取り組んでいる課題はありません</p>
                <p className="text-sm mt-1">新しい課題を追加して、練習の目標を立てましょう</p>
              </div>
            ) : (
              activeChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onToggle={() => onToggleStatus(challenge.id)}
                  onDelete={() => onDelete(challenge.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>完了した課題はまだありません</p>
              </div>
            ) : (
              completedChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onToggle={() => onToggleStatus(challenge.id)}
                  onDelete={() => onDelete(challenge.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい課題を追加</DialogTitle>
              <DialogDescription>
                克服したい弱点や習得したいテクニックを入力してください。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  placeholder="例: 腕十字のディフェンス"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">詳細・メモ (任意)</Label>
                <Textarea
                  id="description"
                  placeholder="具体的な目標や手順など..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>キャンセル</Button>
              <Button onClick={handleAdd} disabled={!newTitle.trim()}>追加する</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ChallengeCard({ 
  challenge, 
  onToggle, 
  onDelete 
}: { 
  challenge: Challenge; 
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        <button 
          onClick={onToggle}
          className={cn(
            "mt-1 flex-shrink-0 transition-colors",
            challenge.status === "completed" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          {challenge.status === "completed" ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={cn(
              "font-medium text-base truncate pr-2",
              challenge.status === "completed" && "line-through text-muted-foreground"
            )}>
              {challenge.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggle}>
                  {challenge.status === "completed" ? "未完了に戻す" : "完了にする"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {challenge.description && (
            <p className={cn(
              "text-sm text-muted-foreground mt-1 line-clamp-2",
              challenge.status === "completed" && "line-through opacity-70"
            )}>
              {challenge.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>開始: {new Date(challenge.startDate).toLocaleDateString()}</span>
            {challenge.completedDate && (
               <span>• 完了: {new Date(challenge.completedDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
