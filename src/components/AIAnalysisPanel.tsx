import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface AIAnalysisPanelProps {
  analysis: string;
  isLoading: boolean;
}

export default function AIAnalysisPanel({ analysis, isLoading }: AIAnalysisPanelProps) {
  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI 智能分析
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI 正在分析文档差异...</p>
            </div>
          ) : analysis ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <Streamdown>{analysis}</Streamdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground text-center">
                上传两篇文档后，AI 将自动分析差异内容
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
