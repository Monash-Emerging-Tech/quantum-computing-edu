/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Load gate and circuit data from JSON files.
 */

import { cache } from "react";

import fs from "fs";
import path from "path";

import { parseGate, Gate, QuantumCircuit } from '@/app/circuit-data/circuit-parsing';

const gateDataDir = path.join(process.cwd(), "app/circuit-data/gates/");

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

export { gateDataDir, loadGate };
