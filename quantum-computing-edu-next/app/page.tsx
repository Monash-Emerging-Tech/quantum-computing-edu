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

import { gateDataDir, loadGate } from '@/app/circuit-data/data-loading';

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
  
  return <div>
    <header>
      <h1 id="page-header"  className={styles["page-header"]}>
        Interactive Quantum Circuits
      </h1>
    </header>
    
    <h2>Gates:</h2>
    <div id="gates-list">
      {
        gates.map(
          ({filename, gate}) => <div key={filename}>
              <Link href={"gates/"+filename}>{gate.full_name}</Link>
            </div>
        )
      }
    </div>
    
    <h2>Circuits:</h2>
    
    <CircuitPage />
  </div>;
}
