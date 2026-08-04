function Search() {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "60px",
      }}
    >
      <input
        type="text"
        placeholder="🔍 Search any service..."
        style={{
          width: "60%",
          padding: "16px",
          fontSize: "18px",
          borderRadius: "12px",
          border: "2px solid #0F62FE",
          outline: "none",
          background: "white",
        }}
      />
    </div>
  );
}

export default Search;