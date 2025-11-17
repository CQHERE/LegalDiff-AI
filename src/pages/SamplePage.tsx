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

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-ai/DeepSeek-V3.2-Exp";
const DEEPSEEK_API_ENDPOINT = import.meta.env.VITE_DEEPSEEK_API_ENDPOINT || 'https://api.siliconflow.cn/v1/chat/completions';
const DEEPSEEK_MAX_TOKENS = Number(import.meta.env.VITE_DEEPSEEK_MAX_TOKENS) || 1024;
const DEEPSEEK_TEMPERATURE = Number(import.meta.env.VITE_DEEPSEEK_TEMPERATURE) || 0.7;
const DEEPSEEK_TOP_P = Number(import.meta.env.VITE_DEEPSEEK_TOP_P) || 0.7;
const DEEPSEEK_TOP_K = Number(import.meta.env.VITE_DEEPSEEK_TOP_K) || 50;
const DEEPSEEK_FREQUENCY_PENALTY = Number(import.meta.env.VITE_DEEPSEEK_FREQUENCY_PENALTY) || 0.5;
const DEEPSEEK_MIN_P = Number(import.meta.env.VITE_DEEPSEEK_MIN_P) || 0.05;
const MAX_OVERVIEW_DIFFS = 20;
const DIFF_SNIPPET_LENGTH = 400;

const sanitizeText = (text: string, maxLength: number): string => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '(空内容)';
  }

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength)}...`;
};

const summarizeDiffs = (diffs: GroupedDiff[]): string => {
  if (diffs.length === 0) {
    return '无可用差异。';
  }

  const items = diffs.slice(0, MAX_OVERVIEW_DIFFS).map((diff, index) => {
    const order = index + 1;
    if (diff.type === 'modified') {
      const removedText = sanitizeText(diff.removed?.value || '', DIFF_SNIPPET_LENGTH / 2);
      const addedText = sanitizeText(diff.added?.value || '', DIFF_SNIPPET_LENGTH / 2);
      return `${order}. [修改] ${removedText} -> ${addedText}`;
    }

    if (diff.type === 'added') {
      const addedText = sanitizeText(diff.added?.value || '', DIFF_SNIPPET_LENGTH);
      return `${order}. [新增] ${addedText}`;
    }

    const removedText = sanitizeText(diff.removed?.value || '', DIFF_SNIPPET_LENGTH);
    return `${order}. [删除] ${removedText}`;
  });

  if (diffs.length > MAX_OVERVIEW_DIFFS) {
    items.push(`... 另有 ${diffs.length - MAX_OVERVIEW_DIFFS} 条差异未列出`);
  }

  return items.join('\n');
};

const formatDiffDetail = (diff: GroupedDiff): string => {
  if (diff.type === 'modified') {
    const removedText = sanitizeText(diff.removed?.value || '', DIFF_SNIPPET_LENGTH);
    const addedText = sanitizeText(diff.added?.value || '', DIFF_SNIPPET_LENGTH);
    return `原文：${removedText}\n修改后：${addedText}`;
  }

  if (diff.type === 'added') {
    const addedText = sanitizeText(diff.added?.value || '', DIFF_SNIPPET_LENGTH);
    return `新增内容：${addedText}`;
  }

  const removedText = sanitizeText(diff.removed?.value || '', DIFF_SNIPPET_LENGTH);
  return `删除内容：${removedText}`;
};

const requestDeepSeekAnalysis = async (prompt: string, onChunk: (chunk: string) => void) => {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('请先在 .env 中配置硅基流动 DeepSeek API 密钥 (VITE_DEEPSEEK_API_KEY)');
  }

  const response = await fetch(DEEPSEEK_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a finance and legal expert. Analyze differences between transaction documents and provide professional insight with actionable recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
      max_tokens: DEEPSEEK_MAX_TOKENS,
      enable_thinking: false,
      thinking_budget: 4096,
      temperature: DEEPSEEK_TEMPERATURE,
      top_p: DEEPSEEK_TOP_P,
      top_k: DEEPSEEK_TOP_K,
      min_p: DEEPSEEK_MIN_P,
      frequency_penalty: DEEPSEEK_FREQUENCY_PENALTY,
      n: 1,
      response_format: { type: 'text' },
      tools: [
        {
          type: 'function',
          function: {
            name: 'noop',
            description: 'Placeholder function metadata to align with SiliconFlow DeepSeek API schema.',
            parameters: {},
            strict: false,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepSeek API 响应错误:', response.status, errorText);
    throw new Error(`AI 分析请求失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content || choice?.delta?.content || choice?.text || '';

  if (!content) {
    throw new Error('未接收到 AI 分析结果，请检查 API 配置');
  }

  onChunk(content);
};

export default function SamplePage() {
  const { toast } = useToast();
  const [doc1, setDoc1] = useState<DocumentInfo | null>(null);
  const [doc2, setDoc2] = useState<DocumentInfo | null>(null);
  const [file1, setFile1] = useState<File | undefined>(undefined);
  const [file2, setFile2] = useState<File | undefined>(undefined);
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
      setFile1(file);
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
      setFile2(file);
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

  const analyzeOverall = async (grouped: GroupedDiff[]) => {
    setIsOverallAnalyzing(true);
    setOverallAnalysis('');

    try {
      // 检查 API 密钥
      if (!DEEPSEEK_API_KEY) {
        throw new Error('请先在 .env 中设置 VITE_DEEPSEEK_API_KEY，以启用 DeepSeek AI 分析');
      }

      const addedCount = grouped.filter(d => d.type === 'added').length;
      const removedCount = grouped.filter(d => d.type === 'removed').length;
      const modifiedCount = grouped.filter(d => d.type === 'modified').length;
      const diffSummary = summarizeDiffs(grouped);

      const prompt = `你是一位具有金融法律专业背景的资深并购律师，正在评审交易文件的改动。基于以下差异信息进行专业解读：

**变更统计**：新增 ${addedCount} 处 | 删除 ${removedCount} 处 | 修改 ${modifiedCount} 处
**主要差异列表**：
${diffSummary}

请输出一份简洁的 Markdown 报告（约 200 字），包含：
1. **变更概览**：主导的修改方向及业务意图
2. **变更程度**：轻微 / 中等 / 重大，并解释判定依据
3. **关键影响**：列出 3 个核心的法律或金融风险/机会
4. **风险提示**：需要特别留意的条款或后续动作

请确保分析紧扣以上差异，语言专业、审慎。`;
      await requestDeepSeekAnalysis(prompt, chunk => {
        setOverallAnalysis(prev => prev + chunk);
      });
    } catch (error) {
      console.error('总体分析错误:', error);
      toast({
        title: 'AI 总体分析失败',
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
      // 检查 API 密钥
      if (!DEEPSEEK_API_KEY) {
        throw new Error('请先在 .env 中设置 VITE_DEEPSEEK_API_KEY，以启用 DeepSeek AI 分析');
      }

      const diffDetail = formatDiffDetail(diff);

      const prompt = `你是一位资深金融法律顾问，请从交易审查的角度解读以下变更：

${diffDetail}

输出格式（控制在 200 字以内）：
1. **内容摘要**：一句话说明变更及动机
2. **重要程度**：用 1-5 ⭐ 评估，并解释影响维度（估值、权利义务、风险分担等）
3. **法律/金融影响**：列出 2 条关键影响
4. **风险提醒**：需要谈判或补充文件的要点

保持专业、结论明确，可引用原文中的关键信息。`;

      await requestDeepSeekAnalysis(prompt, chunk => {
        setDiffAnalysis(prev => prev + chunk);
      });
    } catch (error) {
      console.error('单点分析错误:', error);
      toast({
        title: 'AI 单点分析失败',
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
            selectedFile={file1}
          />
          <DocumentUploader
            label="文档 2（修改版本）"
            onFileSelect={handleDoc2Upload}
            selectedFile={file2}
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
