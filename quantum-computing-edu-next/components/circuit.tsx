/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Server-side components for the interactive circuit.
 */

// Import types and basic gates
import { QuantumCircuit, Operation } from "@/lib/circuit-parsing";

import styles from "./circuit.module.css";

// Import gate component
import OperationComponent from "./gate";

// Import info bubbles
import GateInfoBubble from "./info_bubbles";

import { calculateGateDimensions, calculateOperationSpan } from "./circuit-functions";



/**
 * Create the circuit
 * @param circuit The circuit data
 * @returns JSX quantum circuit container element
 */
const Circuit = ({circuit}: {circuit: QuantumCircuit}) => {
  // Calculate the vertical position of each qubit in the circuit
  const qubitOrder = circuit.registers.flatMap(({qubits}) => qubits);
  let qubitPositions: Array<number> = [];
  qubitOrder.forEach((q, i) => qubitPositions[q] = i);
  
  // Calculate the horizontal positions of the gates
  let qubitLastGatePos: Array<number> = Array(qubitOrder.length).fill(0);
  const gateTimePositions = circuit.operations.map((operation, i) => {
    // Find all qubit positions covered by the gate and its control points
    const [_min_qubit_pos, _max_qubit_pos, covered_positions_filled, covered_qubits_filled] = calculateOperationSpan(operation, qubitOrder, qubitPositions);
    
    // Find the qubit with the rightmost gate position
    const gatePos = Math.max.apply(Math, covered_qubits_filled.map(q => qubitLastGatePos[q]));
    
    // Get the width of the gate
    const [gateWidth, _] = calculateGateDimensions(operation, qubitPositions);
    
    // Update the next gate position for each applicable qubit
    covered_positions_filled.forEach((j) => {
      qubitLastGatePos[qubitOrder[j]] = gatePos+gateWidth;
    });
    return gatePos;
  });
  
  return <div id="circuit-container" className={styles["circuit-container"]}>
    <div id="circuit-grid" className={styles["circuit-grid"]}>
      {
        circuit.registers.map(
          ({name, qubits, description}) => qubits.map(
            (qb, i) => <QubitLine key={i} name={name} qubit={qb} desc={description}/>
          )
        )
      }
      {
        circuit.operations.map(
          (operation, i) => <OperationComponent
            key={i}
            operation={operation}
            qubitOrder={qubitOrder}
            qubitPositions={qubitPositions}
            timePosition={gateTimePositions[i]}
            info_bubble_child={<GateInfoBubble operation={operation} />}
          />
        )
      }
    </div>
    <div id="circuit-qubit-label-container" className={styles["circuit-qubit-label-container"]}>
      {
        circuit.registers.map(
          ({name, qubits, description}, i) => <RegisterLabel
            key={i}
            name={name}
            qubits={qubits}
            desc={description}
            qubitPositions={qubitPositions}
          />
        )
      }
    </div>
  </div>
}

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
  desc,
  qubitPositions
}: {
  name: string,
  qubits: Array<number>,
  desc: string,
  qubitPositions: Array<number>
}) => {
  return <div className={styles["circuit-register"]} title={name+" register"}>
    <div className={styles["circuit-register-text-container"]}>
      <div className={styles["circuit-register-text-align-container"]}>
        <div className={styles["circuit-register-text"]}>{name}</div>
      </div>
    </div>
    {
      qubits.map(
        (q, i) => <div className={styles["circuit-qubit-label"]} key={i}>{q}</div>
      )
    }
  </div>
}

/**
 * Create a qubit line in the circuit
 * @param name Name of the parent register
 * @param qubit Qubit ID
 * @param desc Description of the parent register
 * @returns JSX element
 */
const QubitLine = ({name, qubit, desc}: {name: string, qubit: number, desc: string}) => {
  return <div className={styles["circuit-qubit-line"]} title={name}></div>
}



export default Circuit;
