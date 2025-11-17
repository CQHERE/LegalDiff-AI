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
  groupId?: string;
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
  const timestamp = Date.now();
  
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    const nextChange = i < changes.length - 1 ? changes[i + 1] : null;
    
    // 检查是否是修改：当前是删除，下一个是新增
    if (change.removed && nextChange && nextChange.added) {
      const id = `diff-${i}-${timestamp}`;
      
      // 添加删除部分
      results.push({
        id: `${id}-removed`,
        type: 'removed',
        value: change.value,
        position,
        groupId: id
      });
      
      // 添加新增部分
      results.push({
        id: `${id}-added`,
        type: 'added',
        value: nextChange.value,
        position,
        groupId: id
      });
      
      position += change.value.length;
      i++; // 跳过下一个，因为已经处理了
    } else if (change.added) {
      const id = `diff-${i}-${timestamp}`;
      results.push({
        id,
        type: 'added',
        value: change.value,
        position
      });
    } else if (change.removed) {
      const id = `diff-${i}-${timestamp}`;
      results.push({
        id,
        type: 'removed',
        value: change.value,
        position
      });
    } else {
      const id = `diff-${i}-${timestamp}`;
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

export interface GroupedDiff {
  id: string;
  type: 'added' | 'removed' | 'modified';
  removed?: DiffResult;
  added?: DiffResult;
  position: number;
}

export const getGroupedDiffs = (diffs: DiffResult[]): GroupedDiff[] => {
  const grouped: GroupedDiff[] = [];
  const processedIds = new Set<string>();
  
  for (const diff of diffs) {
    if (diff.type === 'unchanged' || processedIds.has(diff.id)) {
      continue;
    }
    
    // 如果有 groupId，说明是修改类型
    if (diff.groupId) {
      // 查找同组的另一个差异
      const sibling = diffs.find(d => 
        d.groupId === diff.groupId && d.id !== diff.id
      );
      
      if (sibling && !processedIds.has(sibling.id)) {
        grouped.push({
          id: diff.groupId,
          type: 'modified',
          removed: diff.type === 'removed' ? diff : sibling,
          added: diff.type === 'added' ? diff : sibling,
          position: diff.position || 0
        });
        
        processedIds.add(diff.id);
        processedIds.add(sibling.id);
      }
    } else {
      // 单独的新增或删除
      grouped.push({
        id: diff.id,
        type: diff.type as 'added' | 'removed',
        [diff.type]: diff,
        position: diff.position || 0
      });
      
      processedIds.add(diff.id);
    }
  }
  
  return grouped;
};
