/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Parse gate and circuit JSON data that follows either the quantum-gate-schema.json and quantum-circuit-schema.json schemas.
 * Includes type definitions for common quantum computing types.
 */

import { create, all } from 'mathjs';

const math = create(all, { });



/**
 * The structure of a matrix in JSON data
 */
type MatrixData = (number | string)[][];

/**
 * The structure of parameter definitions in quantum gate JSON data
 */
type ParameterDefData = {
  symbol: string,
  min?: string,
  max?: string
};

/**
 * The structure of quantum gate JSON data
 */
type GateData = {
  gate_id: string,
  full_name: string,
  display_name: string,
  color?: string,
  arity: number,
  unitary?: MatrixData,
  subcircuit?: QuantumCircuitData,
  subcircuit_id?: string,
  parameters: ParameterDefData[],
  documentation_file?: string
};

/**
 * The structure of quantum registers in quantum circuit JSON data
 */
type RegisterData = {
  name: string,
  description: string,
  qubits: number[]
};

/**
 * The structure of gate parameter value assignments in quantum circuit JSON data
 */
type ParameterValData = {
  symbol: string,
  value: string,
};

/**
 * The structure of operations in quantum circuit JSON data
 */
type OperationData = {
  gate_id?: string,
  custom_gate?: GateData,
  qubits: number[],
  controls?: number[],
  anticontrols?: number[],
  inverse?: boolean,
  exponent?: number,
  parameter_values?: ParameterValData[]
};

/**
 * The structure of quantum circuit JSON data
 */
type QuantumCircuitData = {
  circuit_id: string,
  full_name: string,
  display_name: string,
  registers: RegisterData[],
  operations: OperationData[],
  documentation_file?: string
};



/**
 * Unitary matrix in Math JS's stringified format
 */
type StringExpressionUnitary = string;

/**
 * The structure of parameter definitions in quantum gate JSON data
 */
type GateParameter = ParameterDefData;

/**
 * The structure of a quantum gate (independent of a quantum circuit)
 */
type Gate = {
  gate_id: string,
  full_name: string,
  display_name: string,
  color?: string,
  arity: number,
  unitary?: StringExpressionUnitary,
  subcircuit?: QuantumCircuit,
  parameters: GateParameter[],
  documentation_file?: string
};

/**
 * The structure of a quantum register
 */
type Register = RegisterData;

/**
 * The structure of gate parameter value assignments in quantum circuit JSON data
 */
type OperationParameterValue = ParameterValData;

/**
 * The structure of a quantum operation (a gate within a quantum circuit)
 */
type Operation = {
  gate: Gate,
  qubits: number[],
  controls: number[],
  anticontrols: number[],
  inverse: boolean,
  exponent: number,
  parameter_values: OperationParameterValue[]
};

/**
 * The structure of a quantum circuit
 */
type QuantumCircuit = {
  circuit_id: string,
  full_name: string,
  display_name: string,
  registers: Register[],
  operations: Operation[],
  documentation_file?: string
};

/**
 * Map gate ids to Gate object instances
 */
type GateMap = Map<string, Gate>;
/**
 * Map circuit ids to QuantumCircuit object instances
 */
type CircuitMap = Map<string, QuantumCircuit>;



/**
 * Generic parsing error triggered by the gate parser
 */
class GateParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GateParsingError";
    Object.setPrototypeOf(this, GateParsingError.prototype);
  }
}

/**
 * Generic parsing error triggered by the circuit parser
 */
class CircuitParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitParsingError";
    Object.setPrototypeOf(this, CircuitParsingError.prototype);
  }
}

/**
 * Error triggered by the gate parser if a subcircuit id is not found
 */
class CircuitNotFoundError extends GateParsingError {
  constructor(message: string) {
    super(message);
    this.name = "CircuitNotFoundError";
    Object.setPrototypeOf(this, CircuitNotFoundError.prototype);
  }
}

/**
 * Error triggered by the circuit parser if a gate id in an operation is not found
 */
class GateNotFoundError extends CircuitParsingError {
  constructor(message: string) {
    super(message);
    this.name = "GateNotFoundError";
    Object.setPrototypeOf(this, GateNotFoundError.prototype);
  }
}



/**
 * Parse a quantum gate from JSON data that has already been validated against quantum-gate-schema.json.
 * @param json_data Quantum gate data that has been converted from JSON to object form with no special parsing.
 * @returns 
 */
const parseGate = (gate_data: GateData, gate_map: GateMap, circuit_map: CircuitMap): Gate => {
  // Copy basic attributes
  const gate_base_obj = {
    gate_id: gate_data.gate_id,
    full_name: gate_data.full_name,
    display_name: gate_data.display_name,
    color: gate_data?.color,
    arity: gate_data.arity,
    parameters: (gate_data.parameters !== undefined ? gate_data.parameters : []) as GateParameter[],
    documentation_file: gate_data?.documentation_file
  };
  
  if (gate_data.unitary) {
    // Defined by a unitary matrix
    const unitary_string = parseUnitary(gate_data.unitary, gate_base_obj.parameters);
    return {
      ...gate_base_obj,
      unitary: unitary_string
    }/* as Gate */;
    
  } else if (gate_data.subcircuit) {
    // Defined by a custom subcircuit
    return {
      ...gate_base_obj,
      subcircuit: parseCircuit(gate_data.subcircuit, gate_map, circuit_map)
    }/* as Gate */;
    
  } else if (gate_data.subcircuit_id) {
    // Defined by a subcircuit in the circuit map
    if (circuit_map.has(gate_data.subcircuit_id)) {
      return {
        ...gate_base_obj,
        subcircuit: circuit_map.get(gate_data.subcircuit_id)
      }/* as Gate */;
    } else {
      // If the subcircuit isn't (yet) in the map, throw an error
      throw new CircuitNotFoundError("Circuit with id "+gate_data.subcircuit_id+" does not exist in the given circuit map.");
    }
    
  }
  
  return gate_base_obj/* as Gate */;
}

/**
 * 
 * @param circuit_data 
 * @returns 
 */
const parseCircuit = (circuit_data: QuantumCircuitData, gate_map: GateMap, circuit_map: CircuitMap): QuantumCircuit => (
  {
    // Copy basic attributes
    circuit_id: circuit_data.circuit_id,
    full_name: circuit_data.full_name,
    display_name: circuit_data.display_name,
    documentation_file: circuit_data?.documentation_file,
    
    // Copy registers directly (no formatting changes)
    registers: circuit_data.registers.map((register_data) => register_data as Register),
    
    // Parse operations
    operations: circuit_data.operations.map((operation_data) => {
      const operation_base_obj = {
        qubits: operation_data.qubits,
        controls: operation_data.controls === undefined ? [] : operation_data.controls,
        anticontrols: operation_data.anticontrols === undefined ? [] : operation_data.anticontrols,
        inverse: operation_data.inverse === undefined ? false : operation_data.inverse,
        exponent: operation_data.exponent === undefined ? 1 : operation_data.exponent,
        parameter_values: (operation_data.parameter_values === undefined ? [] : operation_data.parameter_values) as OperationParameterValue[],
      };
      
      if (operation_data.gate_id) {
        // References a gate in the gate map
        if (gate_map.has(operation_data.gate_id)) {
          return {
            ...operation_base_obj,
            gate: gate_map.get(operation_data.gate_id)!
          }/* as Operation*/;
        } else {
          // If the gate isn't (yet) in the map, throw an error
          throw new GateNotFoundError("Gate with id "+operation_data.gate_id+" does not exist in the given gate map.");
        }
        
      } else if (operation_data.custom_gate) {
        // Defines a custom gate
        return {
          ...operation_base_obj,
          gate: parseGate(operation_data.custom_gate, gate_map, circuit_map)
        }/* as Operation*/;
        
      } else {
        throw new CircuitParsingError("JSON data for circuit "+circuit_data.circuit_id+" contains an operation with no defined gate.");
      }
    })
  }/* as QuantumCircuit*/
);

/**
 * Parse and validate a unitary matrix from JSON data
 * @param matrix_data a 2D array of numbers and/or strings containing mathematical expressions
 * @param parameters list of parameter symbols used in the unitary matrix data
 * @returns Math JS's stringified expression representing the parsed matrix
 */
const parseUnitary = (matrix_data: MatrixData, parameters: GateParameter[]): StringExpressionUnitary => {
  // Verify matrix is square and has a size equal to 2^n, where n ≥ 1.
  let size = matrix_data.length;
  if (size <= 1 || Math.log2(size) % 1 != 0) {
    throw new GateParsingError("Given matrix data doesn't have valid dimensions. Must be a square matrix with width equal to 2^n, where n is an integer >= 1.");
  }
  
  // Verify the matrix is square
  for (let i = 0; i < size; i ++) {
    if (matrix_data[i].length != size) {
      throw new GateParsingError("Given array data is not a square matrix.");
    }
  }
  
  // Parse each cell and stringify the arrays into a string representation of the full matrix
  const unitary_string = "[" + matrix_data.map(
    row => "[" + row.map(
      cell => {
        if (typeof cell == "number") {
          // Keep numbers as numbers
          return cell;
        } else if (typeof cell == "string") {
          // Leave this cell as a string expression
          return cell;
          
          /* 
           * NOTE:
           * This commented code is an extra explicit check to ensure each individual cell
           * is of the correct form, but ultimately the same checks are implicitly performed
           * later when we parse & evaluate the matrix and check whether it is unitary.
           */
          //let full_number;
          //try {
          //  full_number = math.evaluate(cell);
          //} catch (error: any) {
          //  throw new GateParsingError("Evaluating matrix cell failed with error: " + error.message);
          //}
          //const real_part = math.re(full_number);
          //const imag_part = math.im(full_number);
          //if (math.typeOf(real_part) == "number" && math.typeOf(imag_part) == "number") {
          //  // Leave this cell as a string expression
          //  return cell;
          //} else {
          //  throw new GateParsingError("Expression '"+cell+"' in matrix cell does not evaluate to a single complex number.");
          //}
          
        } else {
          throw new GateParsingError("Matrix cell is not of the correct type");
        }
      }
    ).toString() + "]"
  ).toString() + "]";
  
  // Define a Math JS parser to parse the matrix expression
  const parser = math.parser();
  
  // Assign all parameters with values between their parameter bounds (but not equal to their bounds)
  parameters.forEach((parameter) => {
    let value = "1";
    if (parameter.min && parameter.max) {
      value = `(${parameter.min} + ${parameter.max})/2`;
    } else if (parameter.min) {
      value = `${parameter.min} + 1`;
    } else if (parameter.max) {
      value = `${parameter.max} - 1`;
    }
    parser.evaluate(parameter.symbol + " = " + value.toString());
  });
  
  // Parse & evaluate the entire matrix
  let unitary_evaluated;
  try {
    unitary_evaluated = math.matrix(parser.evaluate(unitary_string));
  } catch (error: any) {
    throw new GateParsingError("Creating a Math JS matrix from the parsed and evaluated matrix string failed with error: " + error.message);
  }
  
  // Multiply the unitary matrix by its conjugate transpose (should result in an identity matrix)
  let cancelled_unitary;
  try {
    cancelled_unitary = math.multiply(unitary_evaluated, math.transpose(math.conj(unitary_evaluated)));
  } catch (error: any) {
    throw new GateParsingError("Multiplying the inverse of the unitary matrix by its conjugate transpose failed with error: " + error.message);
  }
  
  // Ensure the matrix is unitary
  if (!math.deepEqual(cancelled_unitary, math.identity(size))) {
    throw new GateParsingError("Matrix is not unitary");
  }
  
  return unitary_string;
}

export type { StringExpressionUnitary, GateData, QuantumCircuitData, Gate, Operation, Register, QuantumCircuit, GateMap, CircuitMap };
export { parseUnitary, parseGate, parseCircuit, GateParsingError, CircuitParsingError, CircuitNotFoundError, GateNotFoundError };
