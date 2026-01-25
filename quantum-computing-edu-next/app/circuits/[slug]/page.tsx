/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for quantum circuit information pages (part of a dynamic route).
 */

import { CircuitMap } from '@/app/circuit-data/circuit-parsing';
import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

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
  
  return (
    <div>
      <h1>Interactive Quantum Circuit</h1>
      <Content slug={slug} circuit_map={circuit_map} />
    </div>
  )
}

async function Content({ slug, circuit_map }: { slug: string, circuit_map: CircuitMap }) {
  // Check if the page slug corresponds to a valid circuit id
  if (!circuit_map.has(slug)) {
    throw new Error("There is no quantum circuit with id "+slug);
  }
  
  const circuit = circuit_map.get(slug)!;
  
  return (
    <article>
      <h2>{circuit.full_name}</h2>
      <p>ID: {circuit.circuit_id}<br/>Number of gates: {circuit.operations.length}</p>
    </article>
  )
}
