import { useState, useRef } from 'react';
import PageMeta from '@/components/common/PageMeta';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentViewer, { type DocumentViewerRef } from '@/components/DocumentViewer';
import DiffNavigator from '@/components/DiffNavigator';
import AIAnalysisPanel from '@/components/AIAnalysisPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseDocument, compareDocuments, generateDiffSummary, getSignificantDiffs, type DiffResult } from '@/services/documentService';
import { sendChatStream } from '@/services/aiService';
import { FileSearch } from 'lucide-react';

const APP_ID = import.meta.env.VITE_APP_ID;
const AI_ENDPOINT = 'https://api-integrations.appmiaoda.com/app-7m0ueu4u3lz5/api-2bk93oeO9NlE/v2/chat/completions';

export default function SamplePage() {
  const [file1, setFile1] = useState<File>();
  const [file2, setFile2] = useState<File>();
  const [diffs, setDiffs] = useState<DiffResult[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeDiffId, setActiveDiffId] = useState<string>();
  const { toast } = useToast();

  const doc1ViewerRef = useRef<DocumentViewerRef>(null);
  const doc2ViewerRef = useRef<DocumentViewerRef>(null);

  const handleCompare = async () => {
    if (!file1 || !file2) {
      toast({
        title: '提示',
        description: '请先上传两篇文档',
        variant: 'destructive'
      });
      return;
    }

    setIsComparing(true);
    setAiAnalysis('');
    setActiveDiffId(undefined);

    try {
      const doc1 = await parseDocument(file1);
      const doc2 = await parseDocument(file2);

      const diffResults = compareDocuments(doc1.content, doc2.content);
      setDiffs(diffResults);

      const summary = generateDiffSummary(diffResults);

      toast({
        title: '比对完成',
        description: summary
      });

      await analyzeWithAI(diffResults, doc1.content, doc2.content);
    } catch (error) {
      console.error('文档比对失败:', error);
      toast({
        title: '错误',
        description: '文档比对失败，请确保上传的是有效的 Word 文档',
        variant: 'destructive'
      });
    } finally {
      setIsComparing(false);
    }
  };

  const handleDiffClick = (diffId: string) => {
    setActiveDiffId(diffId);
    doc1ViewerRef.current?.scrollToDiff(diffId);
    doc2ViewerRef.current?.scrollToDiff(diffId);
  };

  const analyzeWithAI = async (diffResults: DiffResult[], doc1Content: string, doc2Content: string) => {
    setIsAnalyzing(true);

    const significantDiffs = getSignificantDiffs(diffResults);
    
    const addedDiffs = significantDiffs.filter(d => d.type === 'added');
    const removedDiffs = significantDiffs.filter(d => d.type === 'removed');

    let diffDetailsPrompt = '';
    
    if (significantDiffs.length > 0) {
      diffDetailsPrompt = '\n\n## 具体差异点列表：\n\n';
      
      significantDiffs.slice(0, 20).forEach((diff, index) => {
        const type = diff.type === 'added' ? '新增' : '删除';
        const content = diff.value.trim().substring(0, 200);
        diffDetailsPrompt += `### 差异点 ${index + 1}（${type}）\n内容：${content}${diff.value.length > 200 ? '...' : ''}\n\n`;
      });
    }

    const prompt = `你是一位专业的文档分析专家。我需要你分析两篇文档之间的差异，并提供详细的分析报告。

## 文档信息

**文档1（原始版本）**前500字：
${doc1Content.substring(0, 500)}...

**文档2（修改版本）**前500字：
${doc2Content.substring(0, 500)}...

## 差异统计

- 新增内容：${addedDiffs.length} 处
- 删除内容：${removedDiffs.length} 处
${diffDetailsPrompt}

请按照以下格式提供**详细**的分析报告：

# 📊 文档差异分析报告

## 一、差异概览

简要总结两篇文档的主要差异和变更趋势。

## 二、逐项差异分析

### 2.1 新增内容分析

针对每个重要的新增点，请分别分析：

**差异点 1：**
- **内容摘要**：简述新增的内容
- **变更类型**：（如：新增段落/新增条款/新增说明等）
- **重要程度**：⭐⭐⭐⭐⭐（1-5星）
- **影响分析**：说明这个新增内容可能带来的影响
- **建议**：针对这个变更的建议

**差异点 2：**
...（继续分析其他重要新增点，最多分析前10个）

### 2.2 删除内容分析

针对每个重要的删除点，请分别分析：

**差异点 1：**
- **内容摘要**：简述删除的内容
- **变更类型**：（如：删除段落/删除条款/删除说明等）
- **重要程度**：⭐⭐⭐⭐⭐（1-5星）
- **影响分析**：说明这个删除可能带来的影响
- **建议**：针对这个变更的建议

**差异点 2：**
...（继续分析其他重要删除点，最多分析前10个）

## 三、整体变更分析

### 3.1 变更主题
总结本次文档修订的主要主题和方向。

### 3.2 变更程度
评估整体变更的幅度（轻微/中等/重大）。

### 3.3 变更影响
分析整体变更对文档使用者、相关方的影响。

### 3.4 风险提示
指出需要特别关注的风险点。

## 四、总体评价与建议

### 4.1 变更合理性评价
评价本次变更的合理性和必要性。

### 4.2 改进建议
提供进一步改进的建议。

### 4.3 注意事项
列出使用新版本文档时需要注意的事项。

---

**要求**：
1. 分析要专业、客观、有条理
2. 对每个重要差异点都要单独分析
3. 使用中文，语言简洁明了
4. 重要程度用星级表示（⭐）
5. 突出重点，标注关键信息`;

    try {
      await sendChatStream({
        endpoint: AI_ENDPOINT,
        apiId: APP_ID,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        onUpdate: (content: string) => {
          setAiAnalysis(content);
        },
        onComplete: () => {
          setIsAnalyzing(false);
        },
        onError: (error: Error) => {
          console.error('AI 分析失败:', error);
          setIsAnalyzing(false);
          toast({
            title: '错误',
            description: 'AI 分析失败，请稍后重试',
            variant: 'destructive'
          });
        }
      });
    } catch (error) {
      console.error('AI 分析出错:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <PageMeta title="文档智能比对分析工具" description="使用 AI 技术智能比对和分析文档差异" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-[1920px] mx-auto space-y-6">
          <div className="text-center space-y-2 py-8">
            <h1 className="text-4xl font-bold text-foreground">文档智能比对分析工具</h1>
            <p className="text-muted-foreground">快速发现文档变化，AI 智能分析差异内容</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUploader
              label="上传文档 1（原始版本）"
              selectedFile={file1}
              onFileSelect={setFile1}
            />
            <DocumentUploader
              label="上传文档 2（修改版本）"
              selectedFile={file2}
              onFileSelect={setFile2}
            />
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleCompare}
              disabled={!file1 || !file2 || isComparing}
              className="px-8"
            >
              {isComparing ? (
                <>
                  <FileSearch className="w-5 h-5 mr-2 animate-spin" />
                  正在比对...
                </>
              ) : (
                <>
                  <FileSearch className="w-5 h-5 mr-2" />
                  开始比对分析
                </>
              )}
            </Button>
          </div>

          {diffs.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-1">
                <DiffNavigator
                  diffs={diffs}
                  onDiffClick={handleDiffClick}
                  activeDiffId={activeDiffId}
                />
              </div>
              <div className="xl:col-span-1">
                <DocumentViewer
                  ref={doc1ViewerRef}
                  title="文档 1（原始版本）"
                  diffs={diffs}
                  isOriginal={true}
                  highlightDiffId={activeDiffId}
                />
              </div>
              <div className="xl:col-span-1">
                <DocumentViewer
                  ref={doc2ViewerRef}
                  title="文档 2（修改版本）"
                  diffs={diffs}
                  isOriginal={false}
                  highlightDiffId={activeDiffId}
                />
              </div>
              <div className="xl:col-span-1">
                <AIAnalysisPanel
                  analysis={aiAnalysis}
                  isLoading={isAnalyzing}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
