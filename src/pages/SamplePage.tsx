import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentViewer, { DocumentViewerRef } from '@/components/DocumentViewer';
import OverallAnalysisPanel from '@/components/OverallAnalysisPanel';
import DiffAnalysisPanel from '@/components/DiffAnalysisPanel';
import DiffNavigator from '@/components/DiffNavigator';
import { 
  parseDocument, 
  compareDocuments, 
  generateDiffSummary,
  getGroupedDiffs,
  type DocumentInfo,
  type DiffResult,
  type GroupedDiff
} from '@/services/documentService';

const ERNIE_API_KEY = import.meta.env.VITE_ERNIE_API_KEY;
const ERNIE_SECRET_KEY = import.meta.env.VITE_ERNIE_SECRET_KEY;

export default function SamplePage() {
  const { toast } = useToast();
  const [doc1, setDoc1] = useState<DocumentInfo | null>(null);
  const [doc2, setDoc2] = useState<DocumentInfo | null>(null);
  const [diffs, setDiffs] = useState<DiffResult[]>([]);
  const [groupedDiffs, setGroupedDiffs] = useState<GroupedDiff[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [overallAnalysis, setOverallAnalysis] = useState('');
  const [diffAnalysis, setDiffAnalysis] = useState('');
  const [isOverallAnalyzing, setIsOverallAnalyzing] = useState(false);
  const [isDiffAnalyzing, setIsDiffAnalyzing] = useState(false);
  const [activeDiffId, setActiveDiffId] = useState<string>('');
  const [activeDiffNumber, setActiveDiffNumber] = useState<number | undefined>(undefined);

  const doc1ViewerRef = useRef<DocumentViewerRef>(null);
  const doc2ViewerRef = useRef<DocumentViewerRef>(null);

  const handleDoc1Upload = async (file: File) => {
    try {
      const docInfo = await parseDocument(file);
      setDoc1(docInfo);
      toast({
        title: '文档上传成功',
        description: `已上传文档 1：${file.name}`,
      });
    } catch (error) {
      toast({
        title: '文档解析失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    }
  };

  const handleDoc2Upload = async (file: File) => {
    try {
      const docInfo = await parseDocument(file);
      setDoc2(docInfo);
      toast({
        title: '文档上传成功',
        description: `已上传文档 2：${file.name}`,
      });
    } catch (error) {
      toast({
        title: '文档解析失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    }
  };

  const handleCompare = async () => {
    if (!doc1 || !doc2) {
      toast({
        title: '请先上传两个文档',
        variant: 'destructive',
      });
      return;
    }

    setIsComparing(true);
    try {
      const diffResults = compareDocuments(doc1.content, doc2.content);
      setDiffs(diffResults);
      
      const grouped = getGroupedDiffs(diffResults);
      setGroupedDiffs(grouped);
      
      const summary = generateDiffSummary(diffResults);
      
      toast({
        title: '比对完成',
        description: summary,
      });

      // 自动开始总体分析
      await analyzeOverall(grouped);
    } catch (error) {
      toast({
        title: '比对失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsComparing(false);
    }
  };

  const getAccessToken = async (): Promise<string> => {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ERNIE_API_KEY}&client_secret=${ERNIE_SECRET_KEY}`;
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    return data.access_token;
  };

  const analyzeOverall = async (grouped: GroupedDiff[]) => {
    setIsOverallAnalyzing(true);
    setOverallAnalysis('');

    try {
      const accessToken = await getAccessToken();
      
      const addedCount = grouped.filter(d => d.type === 'added').length;
      const removedCount = grouped.filter(d => d.type === 'removed').length;
      const modifiedCount = grouped.filter(d => d.type === 'modified').length;

      const prompt = `你是一位专业的文档分析专家。请对以下文档变更进行总体分析。

**变更统计：**
- 新增内容：${addedCount} 处
- 删除内容：${removedCount} 处
- 修改内容：${modifiedCount} 处

**分析要求：**
请提供一份简洁的总体分析报告，包括：

1. **变更概览**：用 2-3 句话总结本次文档修订的主要方向和目的
2. **变更程度**：评估整体变更幅度（轻微/中等/重大）
3. **关键影响**：列出 3-5 个最重要的影响点
4. **风险提示**：如果存在需要特别注意的风险点，请列出

请使用 Markdown 格式，保持简洁专业。`;

      const response = await fetch(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0-turbo-8k?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            stream: true,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('AI 分析请求失败');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.result) {
                setOverallAnalysis(prev => prev + parsed.result);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      toast({
        title: 'AI 分析失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsOverallAnalyzing(false);
    }
  };

  const analyzeDiff = async (diff: GroupedDiff, index: number) => {
    setIsDiffAnalyzing(true);
    setDiffAnalysis('');
    setActiveDiffNumber(index + 1);

    try {
      const accessToken = await getAccessToken();
      
      let diffDescription = '';
      if (diff.type === 'modified') {
        diffDescription = `**修改前：**\n${diff.removed?.value || ''}\n\n**修改后：**\n${diff.added?.value || ''}`;
      } else if (diff.type === 'added') {
        diffDescription = `**新增内容：**\n${diff.added?.value || ''}`;
      } else {
        diffDescription = `**删除内容：**\n${diff.removed?.value || ''}`;
      }

      const prompt = `你是一位专业的文档分析专家。请分析以下文档差异点：

${diffDescription}

**分析要求：**
请提供针对这个差异点的详细分析，包括：

1. **内容摘要**：用一句话概括这个变更
2. **变更类型**：说明这是什么类型的变更（如：新增条款、删除描述、修改参数等）
3. **重要程度**：用星级评分（⭐⭐⭐⭐⭐ 最高）
4. **影响分析**：这个变更可能带来什么影响
5. **建议**：针对这个变更的专业建议

请使用 Markdown 格式，保持简洁专业。`;

      const response = await fetch(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0-turbo-8k?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            stream: true,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('AI 分析请求失败');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.result) {
                setDiffAnalysis(prev => prev + parsed.result);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      toast({
        title: 'AI 分析失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsDiffAnalyzing(false);
    }
  };

  const handleDiffClick = (diffId: string) => {
    setActiveDiffId(diffId);
    
    // 同步滚动两个文档
    doc1ViewerRef.current?.scrollToDiff(diffId);
    doc2ViewerRef.current?.scrollToDiff(diffId);

    // 查找对应的 diff 并分析
    const index = groupedDiffs.findIndex(d => d.id === diffId);
    if (index !== -1) {
      analyzeDiff(groupedDiffs[index], index);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            文档智能比对分析工具
          </h1>
          <p className="text-muted-foreground">
            上传两篇文档，AI 将自动分析差异并提供专业见解
          </p>
        </div>

        {/* 文档上传区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploader
            label="文档 1（原始版本）"
            onFileSelect={handleDoc1Upload}
          />
          <DocumentUploader
            label="文档 2（修改版本）"
            onFileSelect={handleDoc2Upload}
          />
        </div>

        {/* 比对按钮 */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleCompare}
            disabled={!doc1 || !doc2 || isComparing}
            className="px-8"
          >
            {isComparing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                正在比对...
              </>
            ) : (
              '开始比对分析'
            )}
          </Button>
        </div>

        {/* 总体分析面板 */}
        {groupedDiffs.length > 0 && (
          <OverallAnalysisPanel
            analysis={overallAnalysis}
            isLoading={isOverallAnalyzing}
            addedCount={groupedDiffs.filter(d => d.type === 'added').length}
            removedCount={groupedDiffs.filter(d => d.type === 'removed').length}
            modifiedCount={groupedDiffs.filter(d => d.type === 'modified').length}
          />
        )}

        {/* 比对结果展示区域 */}
        {diffs.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_1fr_350px] gap-4">
            {/* 差异导航 */}
            <div className="xl:col-span-1">
              <DiffNavigator
                groupedDiffs={groupedDiffs}
                onDiffClick={handleDiffClick}
                activeDiffId={activeDiffId}
              />
            </div>

            {/* 文档 1 */}
            <div className="xl:col-span-1">
              <DocumentViewer
                ref={doc1ViewerRef}
                title="文档 1（原始版本）"
                diffs={diffs}
                isOriginal={true}
                highlightDiffId={activeDiffId}
              />
            </div>

            {/* 文档 2 */}
            <div className="xl:col-span-1">
              <DocumentViewer
                ref={doc2ViewerRef}
                title="文档 2（修改版本）"
                diffs={diffs}
                isOriginal={false}
                highlightDiffId={activeDiffId}
              />
            </div>

            {/* 差异点分析 */}
            <div className="xl:col-span-1">
              <DiffAnalysisPanel
                analysis={diffAnalysis}
                isLoading={isDiffAnalyzing}
                diffNumber={activeDiffNumber}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
