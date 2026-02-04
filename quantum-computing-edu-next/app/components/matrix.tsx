/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Matrix display components for gate information.
 */

"use client";

//import { useState, useEffect } from "react";

import { create, all } from 'mathjs';
const math = create(all, { });

import { StringExpressionUnitary, Gate, QuantumCircuit, Operation, parseUnitary } from "@/app/circuit-data/circuit-parsing";

import styles from "./matrix.module.css";



// Import MathJax components
import { MathJaxContext, MathJax } from "nextjs-mathjax";

// Import MathJax dynamically to avoid hydration errors
//import React from 'react';
//import dynamic from 'next/dynamic';
//const MathJaxContext = dynamic(
//  () => import('nextjs-mathjax').then(mod => mod.MathJaxContext),
//  { ssr: false }
//);
//const MathJax = dynamic(
//  () => import('nextjs-mathjax').then(mod => mod.MathJax),
//  { ssr: false }
//);




/**
 * Create the unitary matrix visual
 * @param matrix The matrix data
 * @returns JSX matrix visual container element
 */
const UnitaryMatrixVisual = ({matrix}: {matrix: StringExpressionUnitary}) => {
  
  // Parse the matrix and convert it into a LaTeX string
  const matrix_latex = math.parse(matrix).toTex();
  
  // Insert the LaTeX string into a MathJax component
  return <MathJaxContext>
      <div id="matrix-container" className={styles["matrix-container"]}>
        <MathJax>{matrix_latex}</MathJax>
      </div>
    </MathJaxContext>;
}

export default UnitaryMatrixVisual;
