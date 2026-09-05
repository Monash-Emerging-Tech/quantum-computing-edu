/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Matrix display components for gate information.
 */

"use client";

import { StringExpressionUnitary } from "@/lib/circuit-parsing";
import { all, create } from "mathjs";
import { MathJax, MathJaxContext } from "nextjs-mathjax";
import styles from "./matrix.module.css";

const math = create(all, {});

/**
 * Create the unitary matrix visual
 * @param matrix The matrix data
 * @returns JSX matrix visual container element
 */
const UnitaryMatrixVisual = ({
  matrix,
}: {
  matrix: StringExpressionUnitary;
}) => {
  // Parse the matrix and convert it into a LaTeX string
  const matrix_latex = math.parse(matrix).toTex();

  // Insert the LaTeX string into a MathJax component
  return (
    <MathJaxContext>
      <div id="matrix-container" className={styles["matrix-container"]}>
        <MathJax>{matrix_latex}</MathJax>
      </div>
    </MathJaxContext>
  );
};

export default UnitaryMatrixVisual;
