/**
 * Interactive quantum computing education web interface
 * MNET 2025
 */

import { Unitary, StandardGate, Gate, QuantumCircuit, GateType, GateI, GateX, GateY, GateZ, GateH, GateSwap, GateCNOT, Barrier } from "../components/circuit-types";

const HHLCircuitData: QuantumCircuit = {
  name: "HHL",
  desc: "The Harrow-Hassidim-Lloyd algorithm ...",
  inputs: [
    {
      name: "Matrix A",
      type: "Oracular access matrix"
    },
    {
      name: "Vector b",
      type: "State initialisation"
    }
  ],
  outputs: [
    {
      name: "Vector x",
      type: "Sampled distribution"
    }
  ],
  registers: [
    {
      name: "ancilla",
      qubits: [0],
      desc: "The ancilla qubit, also known as the auxiliary qubit in HHL, is used in the Ancilla Quantum Encoding (AQE) step to encode ..."
    },
    {
      name: "clock",
      qubits: [1,2,3,4,5,6,7,8],
      desc: "The clock register is used by Quantum Phase Estimation (QPE) to store the eigenvalues of the matrix A."
    },
    {
      name: "state",
      qubits: [9,10],
      desc: "The state register, also known as the result register, is initialised with the vector b and used by QPE to estimate the eigenvalues. Upon measurement, this register contains an index (encoded in binary) of the result vector."
    },
  ],
  gates: [
    {
      type: GateType.LARGE,
      name: "Ψ",
      longName: "Encode input vector",
      color: "black",
      qubits: [9,10],
      controls: [],
      anticontrols: [],
      inverse: false,
      //components: 
    } as Gate,
    
    {
      ...Barrier,
      qubits: [0,1,2,3,4,5,6,7,8,9,10],
      controls: [],
      anticontrols: [],
      inverse: false,
    } as Gate,
    
    //{
    //  type: GateType.LARGE,
    //  name: "QPE",
    //  longName: "Quantum Phase Estimation",
    //  color: "blue",
    //  qubits: [1,2,3,4,5,6,7,8,9,10],
    //  controls: [],
    //  anticontrols: [],
    //  //components: 
    //} as Gate,
    ...([...Array(8)].map((_, i) => ({
      ...GateH,
      qubits: [i+1],
      controls: [],
      anticontrols: [],
      inverse: false,
    } as Gate))),
    {
      type: GateType.LARGE,
      name: "U",
      longName: "Hamiltonian Simulation",
      color: "black",
      qubits: [1,2,3,4,5,6,7,8,9,10],
      controls: [],
      anticontrols: [],
      inverse: false,
      //components: 
    } as Gate,
    {
      type: GateType.LARGE,
      name: "QFT",
      longName: "Inverse Quantum Fourier Transform",
      color: "green",
      qubits: [1,2,3,4,5,6,7,8],
      controls: [],
      anticontrols: [],
      inverse: true,
      //components: 
    } as Gate,
    
    {
      ...Barrier,
      qubits: [0,1,2,3,4,5,6,7,8,9,10],
      controls: [],
      anticontrols: [],
      inverse: false,
    } as Gate,
    
    {
      type: GateType.LARGE,
      name: "AQE",
      longName: "Ancilla Quantum Encoding",
      color: "purple",
      qubits: [0,1,2,3,4,5,6,7,8],
      controls: [],
      anticontrols: [],
      inverse: false,
      //components: 
    } as Gate,
    
    {
      ...Barrier,
      qubits: [0,1,2,3,4,5,6,7,8,9,10],
      controls: [],
      anticontrols: [],
      inverse: false,
    } as Gate,
    
    {
      type: GateType.LARGE,
      name: "QPE",
      longName: "Inverse Quantum Phase Estimation",
      color: "blue",
      qubits: [1,2,3,4,5,6,7,8,9,10],
      controls: [],
      anticontrols: [],
      inverse: true,
      //components: 
    } as Gate,
  ]
}

export default HHLCircuitData;
