import { createFileRoute } from "@tanstack/react-router";
import products from "@/data/products.json";
import sampleImg from "@/assets/sample-card.jpeg";

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
    <article className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
      <header className="px-6 pt-6 pb-3 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">
          Decor Chronicle
        </h2>
        <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
          <p>🌐 www.decorchronicle.com</p>
          <p>📱 +91 8595626577</p>
        </div>
      </header>

      <div className="mx-6 rounded-2xl bg-neutral-900 aspect-[3/4] overflow-hidden flex items-center justify-center">
        <img
          src={sampleImg}
          alt={`Product ${p.item_no}`}
          className="w-full h-full object-cover opacity-90"
          loading="lazy"
        />
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col">
        <dl className="space-y-1 text-sm uppercase tracking-wide flex-1">
          {specs.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="font-bold text-foreground">{k} :</dt>
              <dd className="text-foreground/80">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex justify-center">
          <span className="bg-neutral-900 text-rose-300 font-bold text-xl px-8 py-2 rounded-full">
            {Number(p.price).toLocaleString("en-IN")}/-
          </span>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const data = products as Product[];
  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Decor Chronicle Catalogue
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data.length} products · Tag {data[0]?.tag_id}
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((p, i) => (
            <Card key={`${p.item_no}-${i}`} p={p} />
          ))}
        </section>
      </div>
    </main>
  );
}
