import mammoth from 'mammoth';
import * as Diff from 'diff';

export interface DocumentInfo {
  name: string;
  size: number;
  content: string;
}

export interface DiffResult {
  id: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  value: string;
  lineNumber?: number;
  position?: number;
}

export const parseDocument = async (file: File): Promise<DocumentInfo> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  return {
    name: file.name,
    size: file.size,
    content: result.value
  };
};

export const compareDocuments = (doc1Content: string, doc2Content: string): DiffResult[] => {
  const changes = Diff.diffWords(doc1Content, doc2Content);
  
  const results: DiffResult[] = [];
  let position = 0;
  
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    const id = `diff-${i}-${Date.now()}`;
    
    if (change.added) {
      results.push({
        id,
        type: 'added',
        value: change.value,
        position
      });
    } else if (change.removed) {
      results.push({
        id,
        type: 'removed',
        value: change.value,
        position
      });
    } else {
      results.push({
        id,
        type: 'unchanged',
        value: change.value,
        position
      });
    }
    
    position += change.value.length;
  }
  
  return results;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

export const generateDiffSummary = (diffs: DiffResult[]): string => {
  const added = diffs.filter(d => d.type === 'added');
  const removed = diffs.filter(d => d.type === 'removed');
  
  const addedWords = added.reduce((sum, d) => sum + d.value.split(/\s+/).length, 0);
  const removedWords = removed.reduce((sum, d) => sum + d.value.split(/\s+/).length, 0);
  
  return `检测到 ${added.length} 处新增内容（约 ${addedWords} 个词），${removed.length} 处删除内容（约 ${removedWords} 个词）。`;
};

export const getSignificantDiffs = (diffs: DiffResult[]): DiffResult[] => {
  return diffs.filter(d => 
    (d.type === 'added' || d.type === 'removed') && 
    d.value.trim().length > 0
  );
};
