import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import products from "@/data/products.json";
import sampleImg from "@/assets/sample-card.jpeg";
import { exportProductsPdf } from "@/lib/export-pdf";

// Resolve dynamic images from the src/assets folder so we can map
// runtime `image_path` values to actual URLs the dev server/bundler knows about.
const imageMap = import.meta.glob('/src/assets/**', { eager: true, as: 'url' }) as Record<string, string>;

function resolveImageSrc(image_path?: string): string {
  if (!image_path) return sampleImg;
  // normalize windows backslashes
  const path = image_path.replace(/\\\\/g, "/").replace(/\\/g, "/").trim();

  // already a data URL
  if (/^data:/i.test(path)) return path;

  // contains explicit base64 payload (e.g. data:image/png;base64,... or bare base64)
  if (path.includes("base64,")) return path;

  // heuristic: long string of base64 chars (no slashes/dots), treat as raw base64
  if (/^[A-Za-z0-9+/=\s]+$/.test(path) && path.length > 128) {
    return `data:image/png;base64,${path.replace(/\s+/g, "")}`;
  }

  // try to resolve via vite-generated map
  const mapKey = `/src/assets/${path}`;
  if (imageMap[mapKey]) return imageMap[mapKey];

  // fallback to public assets path
  return `/assets/${path}`;
}

export const Route = createFileRoute("/")({
  component: Index,
});

type Product = {
  item_no: string;
  no_of_lamps: string;
  size: string;
  height: string;
  light_source: string;
  finish: string;
  materials: string;
  price: string;
  tag_id: string;
  image_path: string;
};

function Card({ p }: { p: Product }) {
  const specs: [string, string][] = [
    ["MATERIAL", p.materials],
    ["LIGHT SOURCE", p.light_source],
    ["SIZE", p.size],
    ["HEIGHT", p.height],
    ["FINISH", p.finish],
    ["LAMPS", p.no_of_lamps],
    ["ITEM NO", p.item_no],
  ].filter(([, v]) => v && v.trim() !== "") as [string, string][];

  return (
    <article
      className="product-card rounded-2xl overflow-hidden flex flex-col shadow-sm"
      style={{
        backgroundColor: "#cfcfcf",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
        backgroundSize: "3px 3px, 5px 5px",
        backgroundPosition: "0 0, 1px 1px",
      }}
    >
      <header className="px-6 pt-7 pb-2 text-center">
        <h2
          className="text-3xl text-white uppercase leading-none"
          style={{
            fontFamily:
              "'Fredoka', 'Baloo 2', 'Nunito', system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textShadow: "0 2px 0 rgba(0,0,0,0.15)",
          }}
        >
          Decor Chronicle
        </h2>
        <div className="mt-3 text-[13px] text-neutral-800 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-neutral-700" />
            <span>www.decorchronicle.com</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white text-[9px] font-bold">
              W
            </span>
            <span>+91 8595626577</span>
          </p>
        </div>
      </header>

      <div className="product-image-wrap mx-6 mt-3 rounded-[28px] bg-neutral-900 aspect-[3/4] overflow-hidden">
        <img
          src={resolveImageSrc(p.image_path)}
          alt={`Product ${p.item_no}`}
          className="w-full h-full object-contain object-center squircle"
          loading="lazy"
        />
      </div>

      <div className="px-8 pt-5 pb-7 flex-1 flex flex-col items-center text-center">
        <dl className="space-y-1 text-[15px] uppercase tracking-wide flex-1">
          {specs.map(([k, v]) => (
            <div key={k}>
              <span className="font-extrabold text-neutral-900">{k} :</span>{" "}
              <span className="text-neutral-900">{v}</span>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <span
            className="inline-block bg-neutral-900 px-10 py-2.5 rounded-full text-2xl font-extrabold"
            style={{ color: "#a64367" }}
          >
            {Number(p.price).toLocaleString("en-IN")}/-
          </span>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const [data, setData] = useState(products as Product[]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text as string);
      let items: Product[] = [];
      if (Array.isArray(json)) {
        items = json as Product[];
      } else if (json && Array.isArray(json.products)) {
        items = json.products as Product[];
      } else if (json && Array.isArray(json.data)) {
        items = json.data as Product[];
      } else {
        throw new Error("JSON must be an array or an object with a 'products' or 'data' array");
      }

      // Normalize backslashes in image paths
      items = items.map((it) => ({
        ...it,
        image_path: typeof it.image_path === "string" ? it.image_path.replace(/\\\\/g, "/").replace(/\\/g, "/") : it.image_path,
      }));

      setData(items);
    } catch (err) {
      console.error(err);
      alert(`Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 print:hidden no-print">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Decor Chronicle Catalogue
            </h1>
            <p className="mt-2 text-muted-foreground">
              {data.length} products · Tag {data[0]?.tag_id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileSelect}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-full bg-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-600 no-print"
            >
              Upload JSON
            </button>

            <button
              onClick={() => setData(products as Product[])}
              className="inline-flex items-center justify-center rounded-full bg-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-600 no-print"
            >
              Reset
            </button>

        
          </div>
        </header>

        <section className="flex flex-col items-center space-y-6">
          {data.length === 0 ? (
            <p className="text-muted-foreground">No products available</p>
          ) : (
            data.map((p, i) => (
              <div key={`${p.item_no}-${i}`} className="w-full max-w-4xl print-page">
                <Card p={p} />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
