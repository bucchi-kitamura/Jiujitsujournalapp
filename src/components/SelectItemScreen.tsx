import { useState, useMemo } from "react";
import { ArrowLeft, Search, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PageHeader } from "./PageHeader";
import { motion } from "motion/react";
import { cn } from "./ui/utils";

interface SelectItemScreenProps {
  title: string;
  items: string[];
  selectedItem?: string;
  onSelect: (item: string) => void;
  onBack: () => void;
  placeholder?: string;
}

export function SelectItemScreen({
  title,
  items,
  selectedItem,
  onSelect,
  onBack,
  placeholder = "検索...",
}: SelectItemScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleAddNew = () => {
    if (newItemName.trim()) {
      onSelect(newItemName.trim());
      onBack();
    }
  };

  const handleSelectItem = (item: string) => {
    onSelect(item);
    onBack();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader
        title={title}
        leftAction={
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Add New Button */}
        <div className="p-4 border-b border-border">
          {!showAddNew ? (
            <Button
              variant="outline"
              className="w-full h-12 justify-start"
              onClick={() => setShowAddNew(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              新しく追加
            </Button>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="新しい項目を入力"
                className="h-12"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddNew}
                  disabled={!newItemName.trim()}
                  className="flex-1"
                >
                  追加
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewItemName("");
                  }}
                  className="flex-1"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>該当する項目が見つかりません</p>
              <p className="text-sm mt-2">
                「新しく追加」から追加できます
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelectItem(item)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  selectedItem === item
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:bg-accent"
                )}
              >
                <span className="font-medium">{item}</span>
                {selectedItem === item && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
