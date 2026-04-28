/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for quantum gate information pages (part of a dynamic route).
 */

import fs from "fs";

import { GateMap, Gate } from '@/lib/circuit-parsing';
import { loadGatesAndCircuits } from '@/lib/data-loading';

import UnitaryMatrixVisual from "@/components/matrix";

import styles from "./page.module.css";

// Ensure that some core gates have pre-built pages (this is entirely optional)
export async function generateStaticParams() {
  const [gate_map, _circuit_map] = loadGatesAndCircuits();
  return gate_map.values().map((gate) => ({slug: gate.gate_id})).toArray();
}

/**
 * 
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<'/gates/[slug]'>) {
  const { slug } = await params;
  
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  return <Content slug={slug} gate_map={gate_map} />
}

/**
 * Create the gate information page
 * @returns JSX content for the gate page
 */
async function Content({ slug, gate_map }: { slug: string, gate_map: GateMap }) {
  // Check if the page slug corresponds to a valid gate id
  if (!gate_map.has(slug)) {
    throw new Error("There is no quantum gate with id "+slug);
  }
  
  // Get the relevant quantum gate from the gate map
  const gate: Gate = gate_map.get(slug)!;
  
  // Attempt to import the gate documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    gate.documentation_file !== undefined &&
    gate.documentation_file !== "" &&
    fs.existsSync(`${process.cwd()}/data/page-information/${gate.documentation_file}`)
  ) {
    const { default: MarkdownPage_import } = await import(`@/data/page-information/${gate.documentation_file}`);
    MarkdownPage = MarkdownPage_import;
  }
  
  return (
    <div id="gate-page-container" className={styles["gate-page-container"]}>
      <h1 id="page-header"  className={styles["page-header"]}>
        Quantum Gate
      </h1>
      
      <h2 id="circuit-header" className={styles["circuit-header"]}>
        {gate.full_name}
      </h2>
      
      { gate.unitary ? <UnitaryMatrixVisual matrix={gate.unitary} /> : <></> }
      
      <div id="gate-information-container" className={styles["gate-information-container"]}>
        <MarkdownPage />
      </div>
    </div>
  )
}
