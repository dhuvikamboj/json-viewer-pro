import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import products from "@/data/products.json";
import sampleImg from "@/assets/sample-card.jpeg";
import { exportProductsPdf } from "@/lib/export-pdf";

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
      className="rounded-2xl overflow-hidden flex flex-col shadow-sm"
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

      <div className="mx-6 mt-3 rounded-[28px] bg-neutral-900 aspect-[3/4] overflow-hidden">
        <img
          src={sampleImg}
          alt={`Product ${p.item_no}`}
          className="w-full h-full object-cover"
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
