import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Minus, Edit } from 'lucide-react';
import type { GroupedDiff } from '@/services/documentService';

interface DiffNavigatorProps {
  groupedDiffs: GroupedDiff[];
  onDiffClick: (diffId: string) => void;
  activeDiffId?: string;
}

export default function DiffNavigator({ groupedDiffs, onDiffClick, activeDiffId }: DiffNavigatorProps) {
  const addedCount = groupedDiffs.filter(d => d.type === 'added').length;
  const removedCount = groupedDiffs.filter(d => d.type === 'removed').length;
  const modifiedCount = groupedDiffs.filter(d => d.type === 'modified').length;

  const truncateText = (text: string, maxLength: number = 50) => {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'added': return '新增';
      case 'removed': return '删除';
      case 'modified': return '修改';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-diff-added" />;
      case 'removed': return <Minus className="w-4 h-4 text-diff-deleted" />;
      case 'modified': return <Edit className="w-4 h-4 text-diff-modified" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-diff-added/10 text-diff-added border-diff-added/20';
      case 'removed': return 'bg-diff-deleted/10 text-diff-deleted border-diff-deleted/20';
      case 'modified': return 'bg-diff-modified/10 text-diff-modified border-diff-modified/20';
      default: return '';
    }
  };

  const getDisplayText = (diff: GroupedDiff) => {
    if (diff.type === 'modified') {
      const removedText = diff.removed?.value || '';
      const addedText = diff.added?.value || '';
      return `${truncateText(removedText, 25)} → ${truncateText(addedText, 25)}`;
    } else if (diff.type === 'added') {
      return truncateText(diff.added?.value || '');
    } else {
      return truncateText(diff.removed?.value || '');
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>导航</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-diff-added/10">
              <Plus className="w-3 h-3 mr-1" />
              {addedCount}
            </Badge>
            <Badge variant="outline" className="bg-diff-deleted/10">
              <Minus className="w-3 h-3 mr-1" />
              {removedCount}
            </Badge>
            <Badge variant="outline" className="bg-diff-modified/10">
              <Edit className="w-3 h-3 mr-1" />
              {modifiedCount}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-1 p-4">
            {groupedDiffs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                暂无差异内容
              </p>
            ) : (
              groupedDiffs.map((diff, index) => (
                <Button
                  key={diff.id}
                  variant={activeDiffId === diff.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-3 px-3"
                  onClick={() => onDiffClick(diff.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(diff.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={getTypeColor(diff.type)}
                        >
                          {getTypeLabel(diff.type)}
                        </Badge>
                      </div>
                      <p className="text-sm break-words">
                        {getDisplayText(diff)}
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
