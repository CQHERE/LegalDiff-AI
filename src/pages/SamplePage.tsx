import { useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentViewer from '@/components/DocumentViewer';
import AIAnalysisPanel from '@/components/AIAnalysisPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseDocument, compareDocuments, generateDiffSummary, type DiffResult } from '@/services/documentService';
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
  const { toast } = useToast();

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

  const analyzeWithAI = async (diffResults: DiffResult[], doc1Content: string, doc2Content: string) => {
    setIsAnalyzing(true);

    const addedContent = diffResults
      .filter(d => d.type === 'added')
      .map(d => d.value)
      .join('');
    
    const removedContent = diffResults
      .filter(d => d.type === 'removed')
      .map(d => d.value)
      .join('');

    const prompt = `你是一位专业的文档分析专家。我需要你分析两篇文档之间的差异，并提供详细的分析报告。

文档1（原始版本）部分内容：
${doc1Content.substring(0, 500)}...

文档2（修改版本）部分内容：
${doc2Content.substring(0, 500)}...

新增的内容：
${addedContent.substring(0, 1000)}

删除的内容：
${removedContent.substring(0, 1000)}

请按照以下格式提供分析：

## 📊 差异概览
简要总结两篇文档的主要差异

## 🔍 详细分析

### 新增内容分析
- 分析新增内容的类型和目的
- 评估新增内容的重要程度（高/中/低）
- 说明新增内容可能带来的影响

### 删除内容分析
- 分析删除内容的类型
- 评估删除的原因和影响
- 说明删除内容的重要程度（高/中/低）

## 💡 总体评价
对文档变更的整体评价和建议

请用中文回答，语言要专业、简洁、有条理。`;

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
        <div className="max-w-7xl mx-auto space-y-6">
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <DocumentViewer
                  title="文档 1（原始版本）"
                  diffs={diffs}
                  isOriginal={true}
                />
              </div>
              <div className="xl:col-span-1">
                <DocumentViewer
                  title="文档 2（修改版本）"
                  diffs={diffs}
                  isOriginal={false}
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
