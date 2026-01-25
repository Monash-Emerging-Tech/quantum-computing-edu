/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for quantum gate information pages (part of a dynamic route).
 */

import { GateMap } from '@/app/circuit-data/circuit-parsing';
import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

// Ensure that some core gates have pre-built pages (this is entirely optional)
//export async function generateStaticParams() {
//  return [{ slug: 'identity' }, { slug: 'pauli-x' }, { slug: 'pauli-y' }, { slug: 'pauli-z' }, { slug: 'hadamard' }, { slug: 'barrier' }, { slug: 'swap' }]
//}

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
  
  return (
    <div>
      <h1>Quantum Gate</h1>
      <Content slug={slug} gate_map={gate_map} />
    </div>
  )
}

async function Content({ slug, gate_map }: { slug: string, gate_map: GateMap }) {
  // Check if the page slug corresponds to a valid gate id
  if (!gate_map.has(slug)) {
    throw new Error("There is no quantum gate with id "+slug);
  }
  
  const gate = gate_map.get(slug)!;
  
  return (
    <article>
      <h2>{gate.full_name}</h2>
      <p>{gate.gate_id}</p>
    </article>
  )
}
