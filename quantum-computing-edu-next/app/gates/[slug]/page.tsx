/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for quantum gate information pages (part of a dynamic route).
 */

import { loadGate } from '@/app/circuit-data/data-loading';

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
  return (
    <div>
      <h1>Quantum Gate</h1>
      <Content slug={slug} />
    </div>
  )
}

async function Content({ slug }: { slug: string }) {
  const gate = loadGate(slug+".json");
  return (
    <article>
      <h2>{gate.full_name}</h2>
      <p>{gate.gate_id}</p>
    </article>
  )
}
