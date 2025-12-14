/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Standard gates.
 */

import { Unitary, StandardGate, Gate, QuantumCircuit, GateType } from "../components/circuit-types";

/**
 * Define common gates
 */
const GateI: StandardGate = {
  type: GateType.SINGLE,
  name: "I",
  longName: "Identity",
  color: "white",
  unitary: [
    [[1,0],[0,0]],
    [[0,0],[1,0]]
  ]
}
const GateX: StandardGate = {
  type: GateType.SINGLE,
  name: "X",
  longName: "Pauli X", // AKA Not
  color: "blue",
  unitary: [
    [[0,0],[1,0]],
    [[1,0],[0,0]]
  ]
}
const GateY: StandardGate = {
  type: GateType.SINGLE,
  name: "Y",
  longName: "Pauli Y",
  color: "blue",
  unitary: [
    [[0,0],[0,-1]],
    [[0,1],[0,0]]
  ]
}
const GateZ: StandardGate = {
  type: GateType.SINGLE,
  name: "Z",
  longName: "Pauli Z",
  color: "blue",
  unitary: [
    [[1,0],[0,0]],
    [[0,0],[-1,0]]
  ]
}
const GateH: StandardGate = {
  type: GateType.SINGLE,
  name: "H",
  longName: "Hadamard",
  color: "red",
  unitary: [
    [[Math.SQRT1_2,0],[Math.SQRT1_2,0]],
    [[Math.SQRT1_2,0],[-Math.SQRT1_2,0]]
  ]
}
const GateSwap: StandardGate = {
  type: GateType.SWAP,
  name: "SWAP",
  longName: "Swap",
  color: "black",
  unitary: [
    [[1,0],[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[1,0],[0,0]],
    [[0,0],[1,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0],[1,0]]
  ]
}
const GateCNOT: StandardGate = {
  type: GateType.SINGLE,
  name: "CX",
  longName: "Controlled Not",
  color: "black",
  unitary: [
    [[1,0],[0,0],[0,0],[0,0]],
    [[0,0],[1,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0],[1,0]],
    [[0,0],[0,0],[1,0],[0,0]]
  ]
}
const Barrier: StandardGate = {
  type: GateType.LARGE,
  name: "Barrier",
  longName: "Barrier",
  color: "white",
  unitary: []
}

export { GateI, GateX, GateY, GateZ, GateH, GateSwap, GateCNOT, Barrier };
