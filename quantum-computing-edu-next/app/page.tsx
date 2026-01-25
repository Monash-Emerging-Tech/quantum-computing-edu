/**
 * Interactive quantum computing education web interface
 * MNET 2025
 */

//"use client";

import fs from "fs";
import path from "path";
import Link from "next/link";
//import Image from "next/image";

import styles from "./page.module.css";

import Circuit from "./components/circuit";

import HHLCircuitData from './circuit-data/hhl';
import MarkdownHHL from './circuit-data/page-information/hhl.mdx';

import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

// Import MathJax dynamically to avoid hydration errors
//const MathJaxContext = dynamic(
//  () => import('nextjs-mathjax').then(mod => mod.MathJaxContext),
//  { ssr: false }
//);
//
//const MathJax = dynamic(
//  () => import('nextjs-mathjax').then(mod => mod.MathJax),
//  { ssr: false }
//);

export default function Home() {
  //return <CircuitPage />;
  return <HomePage />;
}



/**
 * Create the interactive circuit page
 * @returns JSX content for the circuit page
 */
const CircuitPage = () =>
  //<MathJaxContext>
    <div id="circuit-page-container" className={styles["circuit-page-container"]}>
      <h1 id="page-header"  className={styles["page-header"]}>
        Interactive Quantum Circuits
      </h1>
      
      <h2 id="circuit-header" className={styles["circuit-header"]}>
        Harrow-Hassidim-Lloyd Algorithm
      </h2>
      
      <Circuit data={HHLCircuitData}/>
      
      <div id="circuit-information-container" className={styles["circuit-information-container"]}>
        <MarkdownHHL />
      </div>
    </div>
  //</MathJaxContext>

const HomePage = () => {
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  return <div>
    <header>
      <h1 id="page-header"  className={styles["page-header"]}>
        Interactive Quantum Circuits
      </h1>
    </header>
    
    <h2>Gates:</h2>
    <div id="gates-list">
      {
        gate_map.values().map(
          (gate) => <div key={gate.gate_id}>
              <Link href={"gates/"+gate.gate_id}>{gate.full_name}</Link>
            </div>
        ).toArray()
      }
    </div>
    
    <h2>Circuits:</h2>
    <div id="circuits-list">
      {
        circuit_map.values().map(
          (circuit) => <div key={circuit.circuit_id}>
              <Link href={"circuits/"+circuit.circuit_id}>{circuit.full_name}</Link>
            </div>
        ).toArray()
      }
    </div>
    
    <CircuitPage />
  </div>;
}
