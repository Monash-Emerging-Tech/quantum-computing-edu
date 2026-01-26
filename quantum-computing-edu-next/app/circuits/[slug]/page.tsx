/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for quantum circuit information pages (part of a dynamic route).
 */

import { CircuitMap, QuantumCircuit } from '@/app/circuit-data/circuit-parsing';
import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

import Circuit from "@/app/components/circuit";

import styles from "@/app/page.module.css";

import MarkdownHHL from '@/app/circuit-data/page-information/hhl.mdx';

/**
 * 
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<'/circuits/[slug]'>) {
  const { slug } = await params;
  
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  return <Content slug={slug} circuit_map={circuit_map} />
}

/**
 * Create the interactive circuit page
 * @returns JSX content for the circuit page
 */
async function Content({ slug, circuit_map }: { slug: string, circuit_map: CircuitMap }) {
  // Check if the page slug corresponds to a valid circuit id
  if (!circuit_map.has(slug)) {
    throw new Error("There is no quantum circuit with id "+slug);
  }
  
  const circuit: QuantumCircuit = circuit_map.get(slug)!;
  
  return (
    <div id="circuit-page-container" className={styles["circuit-page-container"]}>
      <h1 id="page-header"  className={styles["page-header"]}>
        Interactive Quantum Circuits
      </h1>
      
      <h2 id="circuit-header" className={styles["circuit-header"]}>
        {circuit.full_name}
      </h2>
      
      <Circuit circuit={circuit} />
      
      <div id="circuit-information-container" className={styles["circuit-information-container"]}>
        <MarkdownHHL />
      </div>
    </div>
  )
}
