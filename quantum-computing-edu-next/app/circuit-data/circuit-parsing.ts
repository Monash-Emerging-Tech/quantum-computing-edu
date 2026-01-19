/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Parse gate and circuit JSON data that follows either the quantum-gate-schema.json and quantum-circuit-schema.json schemas.
 */

import { create, all } from 'mathjs';

const math = create(all, { });

//import { Unitary, StandardGate, GateType } from "../components/circuit-types";



type MatrixData = (number | string)[][];

type GateData = {
  gate_id: string,
  full_name: string,
  display_name: string,
  color?: string,
  arity: number,
  unitary?: MatrixData,
  subcircuit?: QuantumCircuitData,
  documentation_file?: string
};

type OperationData = {
  gate_id?: string,
  custom_gate?: GateData,
  qubits: Array<number>,
  controls: Array<number>,
  anticontrols: Array<number>,
  inverse: boolean
};

type QuantumCircuitData = {
  
  
  operations: OperationData[]
};



type ExpressionUnitary = math.Matrix<math.MathNumericType>;
type ComplexFloatUnitary = [number, number][][];

type Gate = {
  gate_id: string,
  full_name: string,
  display_name: string,
  color?: string,
  arity: number,
  unitary?: ExpressionUnitary,
  unitary_float?: ComplexFloatUnitary,
  subcircuit?: QuantumCircuit,
  documentation_file?: string
};

type Operation = {
  gate: Gate,
  qubits: Array<number>,
  controls: Array<number>,
  anticontrols: Array<number>,
  inverse: boolean
};

type QuantumCircuit = {
  
};



/**
 * Parse a quantum gate from JSON data that has already been validated against quantum-gate-schema.json.
 * @param json_data Quantum gate data that has been converted from JSON to object form with no special parsing.
 * @returns 
 */
const parseGate = (json_data: GateData): Gate => {
  let object = {
    gate_id: json_data.gate_id as string,
    full_name: json_data.full_name as string,
    display_name: json_data.display_name as string,
    color: json_data?.color,
    arity: json_data.arity as number,
    documentation_file: json_data?.documentation_file
  };
  
  if (json_data.unitary) {
    let [unitary_expr, unitary_float] = parseUnitary(json_data.unitary);
    return {
      ...object,
      unitary: unitary_expr,
      unitary_float: unitary_float
    } as Gate;
  } else if (json_data.subcircuit) {
    return {
      ...object,
      subcircuit: parseCircuit(json_data.subcircuit)
    } as Gate;
  } else {
    throw new Error("JSON data for gate "+json_data.gate_id+" does not have a unitary or subcircuit definition.");
  }
}

/**
 * 
 * @param circuit_data 
 * @returns 
 */
const parseCircuit = (circuit_data: QuantumCircuitData): QuantumCircuit => {
  
  throw new Error();
  //return {};
}

/**
 * Parse and validate a unitary matrix from JSON data
 * @param matrix_data a 2D array of numbers and/or strings containing mathematical expressions
 * @returns 
 */
const parseUnitary = (matrix_data: MatrixData): [ExpressionUnitary, ComplexFloatUnitary] => {
  // Verify matrix is square and has a size equal to 2^n, where n ≥ 1.
  let size = matrix_data.length;
  if (size <= 1 || Math.log2(size) % 1 != 0) {
    throw new Error("Given matrix data doesn't have valid dimensions. Must be a square matrix with width equal to 2^n, where n is an integer >= 1.");
  }
  
  // Verify the matrix is square
  for (let i = 0; i < size; i ++) {
    if (matrix_data[i].length != size) {
      throw new Error("Given array data is not a square matrix.");
    }
  }
  
  // Parse each matrix cell into its real and imaginary components
  let complex_unitary = matrix_data.map(
    row => row.map(
      cell => {
        if (typeof cell == "number") {
          return [cell,0] as [number, number];
        } else if (typeof cell == "string") {
          let full_number = math.evaluate(cell);
          let real_part = math.re(full_number);
          let imag_part = math.im(full_number);
          if (math.typeOf(real_part) == "number" && math.typeOf(imag_part) == "number") {
            return [real_part.done(), imag_part.done()] as [number, number];
          } else {
            throw new Error("Expression '"+cell+"' in matrix cell does not evaluate to a single complex number.");
          }
        } else {
          throw new Error("Matrix cell is not of the correct type");
        }
      }
    )
  );
  
  // Evaluate each matrix cell and create a MathJS Matrix object
  let expression_unitary = math.matrix(
    matrix_data.map(
      row => row.map(
        cell => {
          if (typeof cell == "number") {
            return cell;
          } else if (typeof cell == "string") {
            return math.evaluate(cell);
          } else {
            throw new Error("Matrix cell is not of the correct type");
          }
        }
      )
    )
  );
  
  // Ensure the matrix is unitary
  if (!math.deepEqual(math.multiply(math.inv(expression_unitary), math.transpose(math.conj(expression_unitary))), math.identity(size))) {
    throw new Error("Matrix is not unitary");
  }
  
  return [expression_unitary, complex_unitary];
}

export { parseGate, parseCircuit };
