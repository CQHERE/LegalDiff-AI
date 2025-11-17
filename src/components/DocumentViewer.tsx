import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DiffResult } from '@/services/documentService';

interface DocumentViewerProps {
  title: string;
  diffs: DiffResult[];
  isOriginal: boolean;
  highlightDiffId?: string;
  onScroll?: (scrollTop: number) => void;
}

export interface DocumentViewerRef {
  scrollToDiff: (diffId: string) => void;
  setScrollTop: (scrollTop: number) => void;
}

const DocumentViewer = forwardRef<DocumentViewerRef, DocumentViewerProps>(
  ({ title, diffs, isOriginal, highlightDiffId, onScroll }, ref) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const diffRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

    useImperativeHandle(ref, () => ({
      scrollToDiff: (diffId: string) => {
        // 尝试直接查找 diffId
        let element = diffRefs.current.get(diffId);
        
        // 如果找不到，尝试查找 groupId 相关的元素
        if (!element) {
          // 尝试查找 removed 或 added 后缀的元素
          element = diffRefs.current.get(`${diffId}-removed`) || diffRefs.current.get(`${diffId}-added`);
        }
        
        if (element && scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            const elementTop = element.offsetTop;
            const containerHeight = scrollContainer.clientHeight;
            const scrollTop = elementTop - containerHeight / 2 + element.clientHeight / 2;
            scrollContainer.scrollTop = Math.max(0, scrollTop);
          }
        }
      },
      setScrollTop: (scrollTop: number) => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollTop;
          }
        }
      }
    }));

    useEffect(() => {
      if (highlightDiffId) {
        const element = diffRefs.current.get(highlightDiffId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, [highlightDiffId]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      if (onScroll) {
        const target = event.target as HTMLDivElement;
        onScroll(target.scrollTop);
      }
    };

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

      // 检查是否高亮：比较 diff.id 或 diff.groupId
      const isHighlighted = highlightDiffId === diff.id || highlightDiffId === diff.groupId;
      if (isHighlighted) {
        className += ' ring-2 ring-primary ring-offset-2';
      }

      return (
        <span
          key={index}
          id={diff.id}
          ref={(el) => {
            if (el && (diff.type === 'added' || diff.type === 'removed')) {
              diffRefs.current.set(diff.id, el);
              // 如果有 groupId，也用 groupId 存储
              if (diff.groupId) {
                diffRefs.current.set(diff.groupId, el);
              }
            }
          }}
          className={className}
        >
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
          <ScrollArea 
            ref={scrollAreaRef}
            className="h-[600px] px-6 pb-6"
            onScrollCapture={handleScroll}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {diffs.map((diff, index) => renderDiff(diff, index))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
);

DocumentViewer.displayName = 'DocumentViewer';

export default DocumentViewer;

