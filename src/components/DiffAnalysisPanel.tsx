import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface DiffAnalysisPanelProps {
  analysis: string;
  isLoading: boolean;
  diffNumber?: number;
}

export default function DiffAnalysisPanel({ 
  analysis, 
  isLoading, 
  diffNumber 
}: DiffAnalysisPanelProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span>差异点分析</span>
          {diffNumber !== undefined && (
            <Badge variant="secondary">#{diffNumber}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">⚡ AI 快速分析中...</p>
            <p className="text-xs text-muted-foreground/70">使用高速模型，预计 3-5 秒完成</p>
          </div>
        ) : analysis ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Streamdown>{analysis}</Streamdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-muted-foreground">
            <Sparkles className="w-12 h-12 opacity-50" />
            <p className="text-sm text-center">
              点击左侧差异导航中的任意差异点<br />
              查看 AI 针对该差异的详细分析
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
