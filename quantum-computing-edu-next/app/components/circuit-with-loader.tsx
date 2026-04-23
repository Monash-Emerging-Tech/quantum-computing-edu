/**
 * Interactive quantum computing education web interface
 * MNET 2026
 * 
 * Server-side components for the interactive circuit.
 */

import { CircuitMap, QuantumCircuit } from '@/app/circuit-data/circuit-parsing';
import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

import Circuit from "./circuit";



/**
 * Create the circuit
 * @param circuit The circuit data
 * @returns JSX quantum circuit container element
 */
const LoadCircuit = ({circuit_id}: {circuit_id: string}) => {
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  const circuit: QuantumCircuit = circuit_map.get(circuit_id)!;
  
  return <Circuit circuit={circuit} />;
}



export default LoadCircuit;
