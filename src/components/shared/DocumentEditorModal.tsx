import { useEffect, useRef, useState } from "react";
import "../../styles/scan-document.css";

interface Props {
  open: boolean;
  pageCount: number;
  onClose: () => void;
  onApply: () => void;
}

interface PageState {
  id: string;
  variant: "A" | "B";
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  crop: { x: number; y: number; w: number; h: number } | null;
}

const FRAME_W = 360;
const FRAME_H = 468;

function buildPages(count: number): PageState[] {
  return Array.from({ length: Math.max(count, 1) }, (_, i) => ({
    id: `page-${i + 1}`,
    variant: i % 2 === 0 ? "A" : "B",
    // Simulate a reversed duplex back page so flip/rotate is meaningful.
    rotation: i % 2 === 1 ? 180 : 0,
    flipH: false,
    flipV: false,
    crop: null,
  }));
}

/* —— Synthetic scanned-document artwork —— */
function PageArt({ variant }: { variant: "A" | "B" }) {
  if (variant === "A") {
    // Over-scanned bill: dark scanner-bed border + slightly skewed white page.
    return (
      <>
        <rect x="0" y="0" width="400" height="520" fill="#3f4d31" />
        <rect x="0" y="0" width="400" height="520" fill="#2f3a25" opacity="0.35" />
        <g transform="rotate(-3 200 260)">
          <rect x="40" y="46" width="320" height="430" fill="#ffffff" stroke="#d9d9d9" />
          <rect x="64" y="74" width="150" height="16" rx="2" fill="#2b2b2b" />
          <rect x="64" y="100" width="92" height="7" rx="2" fill="#c2c2c2" />
          <rect x="64" y="114" width="120" height="7" rx="2" fill="#c2c2c2" />
          <rect x="64" y="150" width="272" height="1.5" fill="#e2e2e2" />
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <rect x="64" y={170 + r * 26} width="150" height="7" rx="2" fill="#cfcfcf" />
              <rect x="286" y={170 + r * 26} width="50" height="7" rx="2" fill="#cfcfcf" />
            </g>
          ))}
          <rect x="64" y="320" width="272" height="1.5" fill="#e2e2e2" />
          <rect x="220" y="338" width="60" height="9" rx="2" fill="#2b2b2b" />
          <rect x="286" y="338" width="50" height="9" rx="2" fill="#2b2b2b" />
          <path
            d="M70 430 q18 -26 34 -6 q10 14 26 -4 q14 -16 30 2"
            fill="none"
            stroke="#1f5fae"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </>
    );
  }
  // Clean back page (initially upside-down via rotation state).
  return (
    <>
      <rect x="0" y="0" width="400" height="520" fill="#eef0f2" />
      <rect x="26" y="30" width="348" height="460" fill="#ffffff" stroke="#dcdcdc" />
      <rect x="52" y="60" width="180" height="15" rx="2" fill="#2b2b2b" />
      <rect x="52" y="86" width="120" height="7" rx="2" fill="#c2c2c2" />
      <rect x="52" y="124" width="296" height="1.5" fill="#e6e6e6" />
      {[0, 1, 2, 3, 4, 5, 6].map((r) => (
        <rect key={r} x="52" y={144 + r * 24} width={r % 2 ? 250 : 296} height="7" rx="2" fill="#cfcfcf" />
      ))}
      <rect x="52" y="340" width="296" height="1.5" fill="#e6e6e6" />
      <rect x="52" y="360" width="140" height="7" rx="2" fill="#cfcfcf" />
      <rect x="52" y="378" width="200" height="7" rx="2" fill="#cfcfcf" />
    </>
  );
}

function rotFit(rotation: number) {
  return rotation % 180 !== 0 ? Math.min(FRAME_W, FRAME_H) / Math.max(FRAME_W, FRAME_H) : 1;
}

function cropTransform(crop: PageState["crop"], w: number, h: number) {
  if (!crop) return "none";
  const s = Math.min(1 / crop.w, 1 / crop.h);
  const ccx = crop.x + crop.w / 2;
  const ccy = crop.y + crop.h / 2;
  const tx = s * w * (0.5 - ccx);
  const ty = s * h * (0.5 - ccy);
  return `translate(${tx}px, ${ty}px) scale(${s})`;
}

/* Renders a page with rotation/flip/crop applied — used for thumbnails and static view. */
function PageRender({ page, w, h, applyCrop }: { page: PageState; w: number; h: number; applyCrop: boolean }) {
  const fit = rotFit(page.rotation);
  return (
    <div className="doc-editor-render" style={{ width: w, height: h }}>
      <div
        className="doc-editor-render-crop"
        style={{ width: w, height: h, transform: applyCrop ? cropTransform(page.crop, w, h) : "none" }}
      >
        <div
          className="doc-editor-render-rot"
          style={{
            width: w,
            height: h,
            transform: `rotate(${page.rotation}deg) scaleX(${page.flipH ? -1 : 1}) scaleY(${
              page.flipV ? -1 : 1
            }) scale(${fit})`,
          }}
        >
          <svg viewBox="0 0 400 520" width={w} height={h} preserveAspectRatio="xMidYMid meet">
            <PageArt variant={page.variant} />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* —— Toolbar icons —— */
const Icon = {
  rotateLeft: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h6V2" /><path d="M3 8a9 9 0 1 1 1.5 9" />
    </svg>
  ),
  rotateRight: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8h-6V2" /><path d="M21 8a9 9 0 1 0-1.5 9" />
    </svg>
  ),
  flipH: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" /><path d="M9 7 4 12l5 5z" /><path d="M15 7l5 5-5 5z" />
    </svg>
  ),
  flipV: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18" /><path d="M7 9 12 4l5 5z" /><path d="M7 15l5 5 5-5z" />
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v16h16" /><path d="M2 6h16v16" />
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15l6-6 6 6" /></svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
  ),
};

type DragKind = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const MIN = 48;

export function DocumentEditorModal({ open, pageCount, onClose, onApply }: Props) {
  const [pages, setPages] = useState<PageState[]>(() => buildPages(pageCount));
  const [selectedId, setSelectedId] = useState<string>(() => buildPages(pageCount)[0].id);
  const [cropMode, setCropMode] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 36, y: 46, w: FRAME_W - 72, h: FRAME_H - 92 });
  const dragRef = useRef<{ kind: DragKind; sx: number; sy: number; rect: typeof cropRect } | null>(null);

  useEffect(() => {
    if (open) {
      const fresh = buildPages(pageCount);
      setPages(fresh);
      setSelectedId(fresh[0].id);
      setCropMode(false);
    }
  }, [open, pageCount]);

  if (!open) return null;

  const page = pages.find((p) => p.id === selectedId) ?? pages[0];

  function patch(id: string, p: Partial<PageState>) {
    setPages((prev) => prev.map((pg) => (pg.id === id ? { ...pg, ...p } : pg)));
  }

  function move(id: string, dir: -1 | 1) {
    setPages((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    setPages((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((p) => p.id !== id);
      if (id === selectedId) setSelectedId(next[0].id);
      return next;
    });
  }

  function enterCrop() {
    const c = page.crop;
    setCropRect(
      c
        ? { x: c.x * FRAME_W, y: c.y * FRAME_H, w: c.w * FRAME_W, h: c.h * FRAME_H }
        : { x: 36, y: 46, w: FRAME_W - 72, h: FRAME_H - 92 },
    );
    setCropMode(true);
  }

  function applyCrop() {
    patch(page.id, {
      crop: {
        x: cropRect.x / FRAME_W,
        y: cropRect.y / FRAME_H,
        w: cropRect.w / FRAME_W,
        h: cropRect.h / FRAME_H,
      },
    });
    setCropMode(false);
  }

  function startDrag(kind: DragKind, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { kind, sx: e.clientX, sy: e.clientY, rect: { ...cropRect } };
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
  }

  function onDrag(e: PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    let { x, y, w, h } = d.rect;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    if (d.kind === "move") {
      x = clamp(x + dx, 0, FRAME_W - w);
      y = clamp(y + dy, 0, FRAME_H - h);
    } else {
      if (d.kind.includes("e")) w = clamp(w + dx, MIN, FRAME_W - x);
      if (d.kind.includes("s")) h = clamp(h + dy, MIN, FRAME_H - y);
      if (d.kind.includes("w")) {
        const nx = clamp(x + dx, 0, x + w - MIN);
        w += x - nx;
        x = nx;
      }
      if (d.kind.includes("n")) {
        const ny = clamp(y + dy, 0, y + h - MIN);
        h += y - ny;
        y = ny;
      }
    }
    setCropRect({ x, y, w, h });
  }

  function endDrag() {
    dragRef.current = null;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
  }

  const fit = rotFit(page.rotation);
  const handles: DragKind[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

  return (
    <div className="doc-editor-overlay" onClick={onClose}>
      <div className="doc-editor-modal" role="dialog" aria-label="Edit scanned document" onClick={(e) => e.stopPropagation()}>
        <div className="doc-editor-header">
          <span className="doc-editor-title">Edit Scanned Document</span>
          <button className="bill-attach-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="doc-editor-body">
          <aside className="doc-editor-pagelist">
            {pages.map((pg, i) => (
              <div
                key={pg.id}
                className={`doc-editor-thumb${pg.id === selectedId ? " is-selected" : ""}`}
                onClick={() => { setSelectedId(pg.id); setCropMode(false); }}
              >
                <span className="doc-editor-thumb-num">{i + 1}</span>
                <div className="doc-editor-thumb-art">
                  <PageRender page={pg} w={84} h={109} applyCrop />
                </div>
                <div className="doc-editor-thumb-actions">
                  <button title="Move up" disabled={i === 0} onClick={(e) => { e.stopPropagation(); move(pg.id, -1); }}>{Icon.up}</button>
                  <button title="Move down" disabled={i === pages.length - 1} onClick={(e) => { e.stopPropagation(); move(pg.id, 1); }}>{Icon.down}</button>
                  <button title="Delete page" disabled={pages.length <= 1} onClick={(e) => { e.stopPropagation(); remove(pg.id); }}>{Icon.trash}</button>
                </div>
              </div>
            ))}
          </aside>

          <div className="doc-editor-main">
            <div className="doc-editor-toolbar">
              <button onClick={() => patch(page.id, { rotation: (page.rotation + 270) % 360 })} title="Rotate left">{Icon.rotateLeft}<span>Rotate left</span></button>
              <button onClick={() => patch(page.id, { rotation: (page.rotation + 90) % 360 })} title="Rotate right">{Icon.rotateRight}<span>Rotate right</span></button>
              <button onClick={() => patch(page.id, { flipH: !page.flipH })} title="Flip horizontal" className={page.flipH ? "is-active" : ""}>{Icon.flipH}<span>Flip H</span></button>
              <button onClick={() => patch(page.id, { flipV: !page.flipV })} title="Flip vertical" className={page.flipV ? "is-active" : ""}>{Icon.flipV}<span>Flip V</span></button>
              <button onClick={enterCrop} title="Crop" className={cropMode ? "is-active" : ""}>{Icon.crop}<span>Crop</span></button>
              <span className="doc-editor-toolbar-sep" />
              <button onClick={() => { patch(page.id, { rotation: 0, flipH: false, flipV: false, crop: null }); setCropMode(false); }} title="Reset">{Icon.reset}<span>Reset</span></button>
            </div>

            <div className="doc-editor-stage">
              <div className="doc-editor-frame" style={{ width: FRAME_W, height: FRAME_H }}>
                {cropMode ? (
                  <>
                    <div
                      className="doc-editor-render-rot"
                      style={{
                        width: FRAME_W,
                        height: FRAME_H,
                        transform: `rotate(${page.rotation}deg) scaleX(${page.flipH ? -1 : 1}) scaleY(${page.flipV ? -1 : 1}) scale(${fit})`,
                      }}
                    >
                      <svg viewBox="0 0 400 520" width={FRAME_W} height={FRAME_H} preserveAspectRatio="xMidYMid meet">
                        <PageArt variant={page.variant} />
                      </svg>
                    </div>
                    <div className="doc-editor-crop-shade" style={{ clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0, ${cropRect.x}px ${cropRect.y}px, ${cropRect.x}px ${cropRect.y + cropRect.h}px, ${cropRect.x + cropRect.w}px ${cropRect.y + cropRect.h}px, ${cropRect.x + cropRect.w}px ${cropRect.y}px, ${cropRect.x}px ${cropRect.y}px)` }} />
                    <div
                      className="doc-editor-crop-rect"
                      style={{ left: cropRect.x, top: cropRect.y, width: cropRect.w, height: cropRect.h }}
                      onPointerDown={(e) => startDrag("move", e)}
                    >
                      {handles.map((h) => (
                        <span key={h} className={`doc-editor-crop-handle h-${h}`} onPointerDown={(e) => startDrag(h, e)} />
                      ))}
                    </div>
                  </>
                ) : (
                  <PageRender page={page} w={FRAME_W} h={FRAME_H} applyCrop />
                )}
              </div>
              <p className="doc-editor-stage-caption">
                {cropMode ? "Drag the handles to trim borders, then apply crop." : `Page ${pages.findIndex((p) => p.id === page.id) + 1} of ${pages.length}`}
              </p>
            </div>
          </div>
        </div>

        <div className="doc-editor-footer">
          {cropMode ? (
            <>
              <span className="doc-editor-footer-hint">Adjust the crop area over the page</span>
              <span style={{ flex: 1 }} />
              <button className="bill-attach-btn" onClick={() => setCropMode(false)}>Cancel Crop</button>
              <button className="bill-attach-btn bill-attach-btn--primary" onClick={applyCrop}>Apply Crop</button>
            </>
          ) : (
            <>
              <span className="doc-editor-footer-hint">{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
              <span style={{ flex: 1 }} />
              <button className="bill-attach-btn bill-attach-btn--danger" onClick={onClose}>Cancel</button>
              <button className="bill-attach-btn bill-attach-btn--teal" onClick={onApply}>Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
