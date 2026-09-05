/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Server-side components for the interactive circuit.
 */

import { QuantumCircuit } from "@/lib/circuit-parsing";
import {
  calculateGateDimensions,
  calculateOperationSpan,
} from "./circuit-functions";
import styles from "./circuit.module.css";
import OperationComponent from "./gate";
import GateInfoBubble from "./info_bubbles";

/**
 * Create the circuit
 * @param circuit The circuit data
 * @returns JSX quantum circuit container element
 */
const Circuit = ({ circuit }: { circuit: QuantumCircuit }) => {
  // Calculate the vertical position of each qubit in the circuit
  const qubitOrder = circuit.registers.flatMap(({ qubits }) => qubits);
  const qubitPositions: Array<number> = [];
  qubitOrder.forEach((q, i) => (qubitPositions[q] = i));

  // Calculate the horizontal positions of the gates
  const qubitLastGatePos: Array<number> = Array(qubitOrder.length).fill(0);
  const gateTimePositions = circuit.operations.map(operation => {
    // Find all qubit positions covered by the gate and its control points
    const [, , covered_positions_filled, covered_qubits_filled] =
      calculateOperationSpan(operation, qubitOrder, qubitPositions);

    // Find the qubit with the rightmost gate position
    const gatePos = Math.max(
      ...covered_qubits_filled.map(q => qubitLastGatePos[q]),
    );

    // Get the width of the gate
    const [gateWidth] = calculateGateDimensions(operation, qubitPositions);

    // Update the next gate position for each applicable qubit
    covered_positions_filled.forEach(j => {
      qubitLastGatePos[qubitOrder[j]] = gatePos + gateWidth;
    });
    return gatePos;
  });

  return (
    <div id="circuit-container" className={styles["circuit-container"]}>
      <div id="circuit-grid" className={styles["circuit-grid"]}>
        {circuit.registers.map(({ name, qubits }) =>
          qubits.map((qb, i) => <QubitLine key={i} name={name} />),
        )}
        {circuit.operations.map((operation, i) => (
          <OperationComponent
            key={i}
            operation={operation}
            qubitOrder={qubitOrder}
            qubitPositions={qubitPositions}
            timePosition={gateTimePositions[i]}
            info_bubble_child={<GateInfoBubble operation={operation} />}
          />
        ))}
      </div>
      <div
        id="circuit-qubit-label-container"
        className={styles["circuit-qubit-label-container"]}
      >
        {circuit.registers.map(({ name, qubits }, i) => (
          <RegisterLabel
            key={i}
            name={name}
            qubits={qubits}
            //desc={description}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Create a register label to name the qubits
 * @param name Name of the register
 * @param qubits List of Qubit IDs
 * @param desc Description of the register
 * @param qubitPositions Vertical qubit arrangement
 * @returns JSX element
 */
const RegisterLabel = ({
  name,
  qubits,
  //desc,
}: {
  name: string;
  qubits: Array<number>;
  //desc: string,
}) => {
  return (
    <div className={styles["circuit-register"]} title={name + " register"}>
      <div className={styles["circuit-register-text-container"]}>
        <div className={styles["circuit-register-text-align-container"]}>
          <div className={styles["circuit-register-text"]}>{name}</div>
        </div>
      </div>
      {qubits.map((q, i) => (
        <div className={styles["circuit-qubit-label"]} key={i}>
          {q}
        </div>
      ))}
    </div>
  );
};

/**
 * Create a qubit line in the circuit
 * @param name Name of the parent register
 * @param qubit Qubit ID
 * @param desc Description of the parent register
 * @returns JSX element
 */
const QubitLine = ({ name }: { name: string }) => {
  return <div className={styles["circuit-qubit-line"]} title={name}></div>;
};

export default Circuit;
