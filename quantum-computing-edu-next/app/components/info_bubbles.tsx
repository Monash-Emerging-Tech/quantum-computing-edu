/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Components for the the information bubbles that pop up upon hover.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

//import { Unitary, StandardGate, Gate, QuantumCircuit, GateType } from "./circuit-types";
import { Gate } from "../circuit-data/circuit-parsing";

import {
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverClose
} from "./popover";

import styles from "./info-bubbles.module.css";

/**
 * Create an information bubble
 * @returns JSX information bubble element
 */
const GateInfoBubble = ({gate}: {gate: Gate}) => {
  return <PopoverContent className={styles["gate-info-bubble"]}>
    <PopoverHeading>Gate: {gate.full_name}</PopoverHeading>
    <PopoverDescription>Description of this gate goes here.</PopoverDescription>
    {/*<PopoverClose>Close</PopoverClose>*/}
  </PopoverContent>;
}

export default GateInfoBubble;
