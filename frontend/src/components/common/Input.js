const Input = ({ placeholder, value, onChange }) => {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #334155",
        background: "#0f172a",
        color: "white"
      }}
    />
  );
};

export default Input;