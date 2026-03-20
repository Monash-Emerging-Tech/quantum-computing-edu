/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Load gate and circuit data from JSON files.
 */

import { cache } from "react";

import fs from "fs";
import path from "path";

import { parseGate, parseCircuit, Gate, QuantumCircuit, GateData, GateParsingError, CircuitParsingError, CircuitNotFoundError, GateNotFoundError, QuantumCircuitData, GateMap, CircuitMap } from '@/app/circuit-data/circuit-parsing';

const gateDataDir = path.join(process.cwd(), "app/circuit-data/gates/");
const circuitDataDir = path.join(process.cwd(), "app/circuit-data/circuits/");

/**
 * 
 * @param data_file_name 
 * @returns 
 */
const loadDataFile = (data_file_name: string, directory: string): any => {
  // Construct file path to gate JSON file corresponding to the slug
  const file_path = path.join(directory, data_file_name);
  
  // Check if the file exists
  if (!fs.existsSync(file_path)) {
    throw new Error("Given file name does not point to a JSON file.");
  }
  
  // Read the JSON file
  return JSON.parse(fs.readFileSync(file_path).toString("utf8"));
}

/**
 * 
 * @returns 
 */
const loadGatesAndCircuits = cache((): [GateMap, CircuitMap] => {
  const gate_data = fs.readdirSync(gateDataDir)
    .filter(file => file.endsWith(".json"))
    .toSorted()
    .map(file => loadDataFile(file, gateDataDir) as GateData);
  
  const circuit_data = fs.readdirSync(circuitDataDir)
    .filter(file => file.endsWith(".json"))
    .toSorted()
    .map(file => loadDataFile(file, circuitDataDir) as QuantumCircuitData);
  
  let gate_map = new Map<string, Gate>();
  let circuit_map = new Map<string, QuantumCircuit>();
  
  let prev_pending_count = gate_data.length + circuit_data.length;
  
  while (gate_data.length > 0 || circuit_data.length > 0) {
    let i = 0;
    while (i < gate_data.length) {
      try {
        // Parse the gate
        const new_gate = parseGate(gate_data[i], gate_map, circuit_map);
        // Remove the gate from the list of pending gate data
        gate_data.splice(i, 1);
        // Add the gate to the gate map
        gate_map.set(new_gate.gate_id, new_gate);
        
      } catch (error: any) {
        if (error instanceof CircuitNotFoundError || error instanceof GateNotFoundError) {
          // A gate uses a currently-unknown circuit, or a circuit uses a currently-unknown gate
          i += 1;
          console.warn("Dependency not loaded yet:", error.message);
        } else if (error instanceof GateParsingError || error instanceof CircuitParsingError) {
          // There was an error parsing the gate or subcircuit
          gate_data.splice(i, 1);
          console.error("ERROR: " + error.message);
        } else {
          // Some other error happened, possibly fatal
          throw error;
        }
      }
    }
    
    i = 0;
    while (i < circuit_data.length) {
      try {
        // Parse the circuit
        const new_circuit = parseCircuit(circuit_data[i], gate_map, circuit_map);
        // Remove the circuit from the list of pending circuit data
        circuit_data.splice(i, 1);
        // Add the circuit to the circuit map
        circuit_map.set(new_circuit.circuit_id, new_circuit);
        
      } catch (error: any) {
        if (error instanceof CircuitNotFoundError || error instanceof GateNotFoundError) {
          // A gate uses a currently-unknown circuit, or a circuit uses a currently-unknown gate
          i += 1;
          console.warn("Dependency not loaded yet:", error.message);
        } else if (error instanceof GateParsingError || error instanceof CircuitParsingError) {
          // There was an error parsing the gate or subcircuit
          circuit_data.splice(i, 1);
          console.error("ERROR: " + error.message);
        } else {
          // Some other error happened, possibly fatal
          throw error;
        }
      }
    }
    
    // Verify that the number of pending gates or circuits decreased
    if (gate_data.length + circuit_data.length == prev_pending_count) {
      throw new Error("Some gates/circuits could not be parsed due to missing circuit/gate dependencies. Check gates [" + gate_data.map((gate) => gate.gate_id).toString() + "] and circuits [" + circuit_data.map((circuit) => circuit.circuit_id).toString() + "]");
    }
    
    prev_pending_count = gate_data.length + circuit_data.length;
  }
  
  return [gate_map, circuit_map];
});

export { gateDataDir, circuitDataDir, loadGatesAndCircuits };
