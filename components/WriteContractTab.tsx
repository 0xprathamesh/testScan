import { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";

const WriteContractTab = ({
  writeFunctions,
  inputs,
  handleInputChange,
  handleWriteFunctions,
  results,
}: {
  writeFunctions: any[];
  inputs: { [key: string]: any[] };
  handleInputChange: (fnName: string, idx: number, value: string) => void;
  handleWriteFunctions: (fn: any) => void;
  results: { [key: string]: any };
}) => {
  return (
    <div className="results">
      {writeFunctions.map((fn, index) => (
        <div key={index}>
          <div  className="read-function mb-4">
            <h2>{fn.name}</h2>
            {fn.inputs && fn.inputs.length > 0 && (
              <div className="inputs">
                {fn.inputs.map((input: any, idx: number) => (
                  <InputField
                    key={idx}
                    input={input}
                    idx={idx}
                    fnName={fn.name}
                    handleInputChange={handleInputChange}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => handleWriteFunctions(fn)}
              className="bg-green-400 px-4 py-2 rounded-md"
            >
              Call {fn.name}
            </button>
          </div>
          {results[fn.name] && (
            <Link
              href={`https://apothem.xdcscan.io/tx/${results[fn.name].hash}`}
              target="_blank"
            >
              <button className="bg-green-400 px-3 py-2 rounded-md">
                Hash
              </button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default WriteContractTab;
