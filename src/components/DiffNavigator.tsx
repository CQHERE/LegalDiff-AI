import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import type { DiffResult } from '@/services/documentService';

interface DiffNavigatorProps {
  diffs: DiffResult[];
  onDiffClick: (diffId: string) => void;
  activeDiffId?: string;
}

export default function DiffNavigator({ diffs, onDiffClick, activeDiffId }: DiffNavigatorProps) {
  const significantDiffs = diffs.filter(d => 
    (d.type === 'added' || d.type === 'removed') && 
    d.value.trim().length > 0
  );

  const addedCount = significantDiffs.filter(d => d.type === 'added').length;
  const removedCount = significantDiffs.filter(d => d.type === 'removed').length;

  const truncateText = (text: string, maxLength: number = 50) => {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>差异导航</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-diff-added/10">
              <Plus className="w-3 h-3 mr-1" />
              {addedCount}
            </Badge>
            <Badge variant="outline" className="bg-diff-deleted/10">
              <Minus className="w-3 h-3 mr-1" />
              {removedCount}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-1 p-4">
            {significantDiffs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                暂无差异内容
              </p>
            ) : (
              significantDiffs.map((diff, index) => (
                <Button
                  key={diff.id}
                  variant={activeDiffId === diff.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-3 px-3"
                  onClick={() => onDiffClick(diff.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {diff.type === 'added' ? (
                        <Plus className="w-4 h-4 text-diff-added" />
                      ) : (
                        <Minus className="w-4 h-4 text-diff-deleted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={
                            diff.type === 'added' 
                              ? 'bg-diff-added/10 text-diff-added border-diff-added/20' 
                              : 'bg-diff-deleted/10 text-diff-deleted border-diff-deleted/20'
                          }
                        >
                          {diff.type === 'added' ? '新增' : '删除'}
                        </Badge>
                      </div>
                      <p className="text-sm break-words">
                        {truncateText(diff.value)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 text-muted-foreground" />
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
