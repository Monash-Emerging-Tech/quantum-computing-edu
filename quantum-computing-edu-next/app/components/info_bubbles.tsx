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
 * Create the gate information page
 * @returns JSX content for the gate page
 */
async function GatePopoverDescription({operation}: {operation: Operation}) {
  
  // Attempt to import the gate documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    operation.gate.documentation_file !== undefined &&
    operation.gate.documentation_file !== "" &&
    fs.existsSync(`${process.cwd()}/app/circuit-data/popup-descriptions/${operation.gate.documentation_file}`)
  ) {
    const { default: MarkdownPage_import } = await import(`@/app/circuit-data/popup-descriptions/${operation.gate.documentation_file}`);
    MarkdownPage = MarkdownPage_import;
  }
  
  return (
    <div>
      { operation.gate.unitary ? <UnitaryMatrixVisual matrix={operation.gate.unitary} /> : <></> }
      
      <div id="gate-information-container" className={styles["gate-information-container"]}>
        <MarkdownPage />
      </div>
    </div>
  )
}

export default GateInfoBubble;
