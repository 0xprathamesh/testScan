const InputField = ({
  input,
  idx,
  fnName,
  handleInputChange,
}: {
  input: any;
  idx: number;
  fnName: string;
  handleInputChange: (fnName: string, idx: number, value: string) => void;
}) => {
  return (
    <div key={idx} className="mb-2">
      <label>{input.name || `Input ${idx + 1}`}:</label>
      <input
        type="text"
        placeholder={input.type}
        className="ml-2 p-1 border rounded-md"
        onChange={(e) => handleInputChange(fnName, idx, e.target.value)}
      />
    </div>
  );
};

export default InputField;
