/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Components for the the information bubbles that pop up upon hover.
 */

import fs from "fs";

import Link from "next/link";

import { Operation } from '@/app/circuit-data/circuit-parsing';

import UnitaryMatrixVisual from "@/app/components/matrix";
import Circuit from "@/app/components/circuit";

// Import MathJax components
import { MathJaxContext, MathJax } from "nextjs-mathjax";

import {
  PopoverContent,
  //PopoverDescription,
  PopoverHeading,
  //PopoverClose
} from "./popover";

import styles from "./info-bubbles.module.css";

/**
 * Create an information bubble
 * @returns JSX information bubble element
 */
const GateInfoBubble = ({operation}: {operation: Operation}) => {
  return <PopoverContent className={styles["gate-info-bubble"]}>
    <PopoverHeading>
      <Link href={"/gates/"+operation.gate.gate_id}>
        Gate: {operation.gate.full_name}
      </Link>
    </PopoverHeading>
    <GatePopoverDescription operation={operation} />
  </PopoverContent>;
}

/**
 * Create the operation information popup content
 * @param operation operation object containing all relevant information about the operation in the context of the circuit
 * @returns JSX content for the operation popup
 */
async function GatePopoverDescription({operation}: {operation: Operation}) {
  
  // Attempt to import the gate documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    operation.gate.documentation_file !== undefined &&
    operation.gate.documentation_file !== ""
  ) {
    // Look for the popup description first
    if (fs.existsSync(`${process.cwd()}/app/circuit-data/popup-descriptions/${operation.gate.documentation_file}`)) {
      const { default: MarkdownPage_import } = await import(`@/app/circuit-data/popup-descriptions/${operation.gate.documentation_file}`);
      MarkdownPage = MarkdownPage_import;
      
    } else if (fs.existsSync(`${process.cwd()}/app/circuit-data/page-information/${operation.gate.documentation_file}`)) {
      // Fall back to the full-page gate information
      const { default: MarkdownPage_import } = await import(`@/app/circuit-data/page-information/${operation.gate.documentation_file}`);
      MarkdownPage = MarkdownPage_import;
    }
  }
  
  // Add information about the operation (the specific instance of the gate in the context of the circuit)
  let operation_info = [
    <div key="qubits">This gate is applied to qubit{operation.qubits.length > 1 ? ("s "+operation.qubits.join(", ")) : (" "+operation.qubits[0])}.</div>
  ];
  if (operation.inverse) {
    operation_info.push(<div key="inv">This gate is inverted.</div>);
  }
  if (operation.exponent > 1) {
    operation_info.push(<div key="exp">This gate is repeated {operation.exponent} times.</div>);
  }
  operation.parameter_values.forEach(({symbol, value}) => {
    operation_info.push(<div key={"param"+symbol}>Parameter {symbol} = {value}.</div>);
  });
  if (operation.controls.length > 0 || operation.anticontrols.length > 0) {
    operation_info.push(<div key={"controlslist"}>
      This gate is enabled if:
      <ul>
        {operation.controls.map((control) =>
          <li key={"control"+control}>qubit {control} is |1⟩</li>
        )}
        {operation.anticontrols.map((anticontrol) =>
          <li key={"anticontrol"+anticontrol}>qubit {anticontrol} is |0⟩</li>
        )}
      </ul>
    </div>);
  }
  
  return (
    <div>
      { operation.gate.unitary ? <UnitaryMatrixVisual matrix={operation.gate.unitary} /> : <></> }
      { operation.gate.subcircuit ? <Circuit circuit={operation.gate.subcircuit}/> : <></> }
      
      <div id="gate-information-container" className={styles["gate-information-container"]}>
        <MarkdownPage />
      </div>
      
      <br/>
      <h2>Operation Information</h2>
      <div>
        {operation_info}
      </div>
    </div>
  )
}

export default GateInfoBubble;
