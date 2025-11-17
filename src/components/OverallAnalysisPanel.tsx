import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface OverallAnalysisPanelProps {
  analysis: string;
  isLoading: boolean;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
}

export default function OverallAnalysisPanel({ 
  analysis, 
  isLoading, 
  addedCount, 
  removedCount, 
  modifiedCount 
}: OverallAnalysisPanelProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>文档总体分析</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-diff-added/10">
              新增 {addedCount}
            </Badge>
            <Badge variant="outline" className="bg-diff-deleted/10">
              删除 {removedCount}
            </Badge>
            <Badge variant="outline" className="bg-diff-modified/10">
              修改 {modifiedCount}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">AI 正在分析文档整体变更...</p>
          </div>
        ) : analysis ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Streamdown>{analysis}</Streamdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-muted-foreground">
            <TrendingUp className="w-12 h-12 opacity-50" />
            <p className="text-sm">等待 AI 分析结果...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
