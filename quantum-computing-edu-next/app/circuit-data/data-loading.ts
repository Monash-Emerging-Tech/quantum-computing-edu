/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Load gate and circuit data from JSON files.
 */

import { cache } from "react";

import fs from "fs";
import path from "path";

import { parseGate, parseCircuit, Gate, QuantumCircuit, GateData, GateParsingError, CircuitParsingError, CircuitNotFoundError, GateNotFoundError, QuantumCircuitData } from '@/app/circuit-data/circuit-parsing';

const gateDataDir = path.join(process.cwd(), "app/circuit-data/gates/");
const circuitDataDir = path.join(process.cwd(), "app/circuit-data/circuits/");

/**
 * 
 * @param data_file_name 
 * @returns 
 */
const loadGate = (data_file_name: string) => {
  // Construct file path to gate JSON file corresponding to the slug
  const file_path = path.join(gateDataDir, data_file_name);
  
  // Check if the file exists
  if (!fs.existsSync(file_path)) {
    throw new Error("Given slug name does not point to a JSON file.");
  }
  
  // Read the JSON file and parse it
  return parseGate(JSON.parse(fs.readFileSync(file_path).toString("utf8")), new Map(), new Map());
  //return JSON.parse(fs.readFileSync(file_path).toString("utf8"));
}

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
const loadGatesAndCircuits = cache((): [Map<string, Gate>, Map<string, QuantumCircuit>] => {
  const gate_data = fs.readdirSync(gateDataDir)
    .filter(file => file.endsWith(".json"))
    .toSorted()
    .toReversed()
    .map(file => loadDataFile(file, gateDataDir) as GateData);
  
  const circuit_data = fs.readdirSync(circuitDataDir)
    .filter(file => file.endsWith(".json"))
    .toSorted()
    .toReversed()
    .map(file => loadDataFile(file, circuitDataDir) as QuantumCircuitData);
  
  let gate_map = new Map<string, Gate>();
  let circuit_map = new Map<string, QuantumCircuit>();
  
  let prev_pending_count = gate_data.length + circuit_data.length;
  
  while (gate_data.length > 0) {
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
        } else if (error instanceof GateParsingError || error instanceof CircuitParsingError) {
          // There was an error parsing the gate or subcircuit
          gate_data.splice(i, 1);
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
        } else if (error instanceof GateParsingError || error instanceof CircuitParsingError) {
          // There was an error parsing the gate or subcircuit
          circuit_data.splice(i, 1);
        } else {
          // Some other error happened, possibly fatal
          throw error;
        }
      }
    }
    
    // Verify that the number of pending gates or circuits decreased
    if (gate_data.length + circuit_data.length == prev_pending_count) {
      throw new Error("Some gates/circuits could not be parsed, due to missing circuit/gate dependencies. Check gates " + gate_data.map((gate) => gate.gate_id) + " and circuits " + circuit_data.map((circuit) => circuit.circuit_id));
    }
    
    prev_pending_count = gate_data.length + circuit_data.length;
  }
  
  return [gate_map, circuit_map];
});

/**
 * 
 * @returns 
 */
const loadAllGates = cache((): {filename: string, gate: Gate}[] => {
  const jsonFiles = fs.readdirSync(gateDataDir)
    .filter(file => file.endsWith(".json"))
    .toSorted()
    .toReversed();
  
  const gates = jsonFiles.map(
    file => ({
      filename: file.replace(".json", ""),
      gate: loadGate(file)
    })
  );
  
  return gates;
});

/**
 * 
 * @param gates 
 * @returns 
 */
const createGateMap = (gates: {filename: string, gate: Gate}[]): Map<string, Gate> => {
  let gate_map = new Map<string, Gate>();
  
  // Add all gates to the map
  gates.forEach(({gate}: {filename: string, gate: Gate}) => {
    gate_map.set(gate.gate_id, gate);
  });
  
  return gate_map;
}

export { gateDataDir, loadGate, loadGatesAndCircuits };
