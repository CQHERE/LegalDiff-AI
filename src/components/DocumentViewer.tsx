import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DiffResult } from '@/services/documentService';

interface DocumentViewerProps {
  title: string;
  diffs: DiffResult[];
  isOriginal: boolean;
}

export default function DocumentViewer({ title, diffs, isOriginal }: DocumentViewerProps) {
  const renderDiff = (diff: DiffResult, index: number) => {
    if (isOriginal && diff.type === 'added') {
      return null;
    }
    
    if (!isOriginal && diff.type === 'removed') {
      return null;
    }

    let className = 'inline';
    
    if (diff.type === 'added') {
      className = 'inline bg-diff-added/20 text-foreground px-1 rounded';
    } else if (diff.type === 'removed') {
      className = 'inline bg-diff-deleted/20 text-foreground px-1 rounded line-through';
    }

    return (
      <span key={index} className={className}>
        {diff.value}
      </span>
    );
  };

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[600px] px-6 pb-6">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {diffs.map((diff, index) => renderDiff(diff, index))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
