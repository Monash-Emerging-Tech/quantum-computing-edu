/**
 * Interactive quantum computing education web interface
 * MNET 2026
 *
 * Display the matrix for a gate, by gate ID.
 */

import { loadGatesAndCircuits } from "@/lib/data-loading";
import UnitaryMatrixVisual from "./matrix";

/**
 * Load the specified gate and render its matrix.
 * @param gate_id The gate identifier
 */
const LoadGateMatrix = ({ gate_id }: { gate_id: string }) => {
  const [gate_map] = loadGatesAndCircuits();
  const gate = gate_map.get(gate_id);
  return gate?.unitary ? <UnitaryMatrixVisual matrix={gate.unitary} /> : <></>;
};

export default LoadGateMatrix;
