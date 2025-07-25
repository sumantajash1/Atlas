'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DndContext,
  rectIntersection,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ReactNode } from 'react';

export type { DragEndEvent } from '@dnd-kit/core';

export type Status = {
  id: string;
  name: string;
  color: string;
};

export type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
  description?: string;
  sublabel?: string;
};

export type KanbanBoardProps = {
  id: Status['id'];
  children: ReactNode;
  className?: string;
  name: string;
  color: string;
};

export const KanbanBoard = ({ id, children, className, name, color }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex h-full min-h-40 flex-col gap-3 rounded-xl bg-slate-800 p-4 text-xs shadow-md transition-all w-full',
        isOver ? 'outline-primary' : 'outline-transparent',
        className
      )}
      ref={setNodeRef}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-base text-slate-100">{name}</span>
      </div>
      {children}
    </div>
  );
};

export type KanbanCardProps = Pick<Feature, 'id' | 'name' | 'description' | 'sublabel'> & {
  index: number;
  parent: string;
  className?: string;
};

export const KanbanCard = ({
  id,
  name,
  description,
  sublabel,
  index,
  parent,
  className,
}: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id,
      data: { index, parent },
    });

  return (
    <Card
      className={cn(
        'rounded-lg p-4 shadow bg-slate-800 mb-2',
        className
      )}
      style={{
        transform: transform
          ? `translateX(${transform.x}px) translateY(${transform.y}px)`
          : 'none',
      }}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <div className="font-semibold text-slate-100 text-sms">{name}</div>
      {sublabel && <div className="text-xs text-slate-400">{sublabel}</div>}
      {description && <div className="text-xs text-slate-400">{description}</div>}
    </Card>
  );
};

export type KanbanCardsProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2', className)}>{children}</div>
);

export type KanbanHeaderProps =
  | {
    children: ReactNode;
  }
  | {
    name: Status['name'];
    color: Status['color'];
    className?: string;
  };

export const KanbanHeader = (props: KanbanHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div className={cn('flex shrink-0 items-center gap-2', props.className)}>
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: props.color }}
      />
      <p className="m-0 font-semibold text-sm">{props.name}</p>
    </div>
  );

export type KanbanProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  className?: string;
};

export const KanbanProvider = ({
  children,
  onDragEnd,
  className,
}: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div
      className={cn('grid w-full auto-cols-fr grid-flow-col gap-6', className)}
      style={{ minHeight: '400px' }}
    >
      {children}
    </div>
  </DndContext>
);
