/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Main page, linking to other pages.
 */

import Link from "next/link";

import styles from "./page.module.css";

import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';

export default function Home() {
  return <HomePage />;
}



const HomePage = () => {
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  return <div id="main-page-container" className={styles["main-page-container"]}>
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
  </div>;
}
