import type { LucideIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export const sharedMediaName = (kind: 'work' | 'verification', id: string) => 'evidence-' + kind + '-' + CSS.escape(id);

export function DetailLink<T>({ to, id, className, queryKey, queryFn, children }: {
  to: string; id: string; className: string; queryKey: readonly string[]; queryFn: () => Promise<T>; children: ReactNode;
}) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const state = { rowOrigin: { path: pathname, search, id } };
  const prefetch = () => void client.prefetchQuery({ queryKey, queryFn });
  return <Link to={to} state={state} id={id} className={className} onPointerEnter={prefetch} onFocus={prefetch}
    onClick={event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || !client.getQueryData(queryKey)) return;
      event.preventDefault();
      const transition = document.startViewTransition(() => navigate(to, { state, flushSync: true }));
      // The browser can skip a snapshot if the window changes size during navigation.
      void transition.ready.catch(() => undefined);
    }}>{children}</Link>;
}

export function LayerMotif({ icon: Icon, image = false }: { icon: LucideIcon; image?: boolean }) {
  return <div className={'layer-motif' + (image ? ' layer-motif-image' : '')} aria-hidden="true">
    <div className="motif-plane motif-back" />
    <div className="motif-plane motif-middle" />
    <div className="motif-plane motif-front">{image ? <img src="/media/ceramic.jpg" alt="" /> : <Icon size={35} />}</div>
    {image && <span className="motif-badge"><img src="/media/mark.svg" alt="" /></span>}
    <span className="motif-trace" />
  </div>;
}

export function WorkspaceBanner({ context, title, description, icon }: { context: string; title: string; description: string; icon: LucideIcon }) {
  return <header className="workspace-banner">
    <div className="workspace-banner-copy"><p className="context">{context}</p><h1>{title}</h1><p>{description}</p></div>
    <LayerMotif icon={icon} />
  </header>;
}
