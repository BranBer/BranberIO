import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface BranBerEditor {
  onChange: (e: string) => void;
  value: string;
}

const BranBerEditor = ({ onChange, value }: BranBerEditor) => {
  return <ReactQuill value={value} onChange={onChange} />;
};

export default BranBerEditor;
