
import fs from "fs";
import path from "path";

import { parseGate } from '@/app/circuit-data/circuit-parsing';

const gateDataDir = path.join(process.cwd(), "app/circuit-data/gates/");

/**
 * 
 * @param slug 
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
  return parseGate(JSON.parse(fs.readFileSync(file_path).toString("utf8")));
  //return JSON.parse(fs.readFileSync(file_path).toString("utf8"));
}

export { gateDataDir, loadGate };
