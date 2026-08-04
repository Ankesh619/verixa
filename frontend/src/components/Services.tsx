const cardStyle = {
  width: "220px",
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center" as const,
  boxShadow: "0 5px 15px rgba(0,0,0,.1)",
};

function Services() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
        paddingBottom: "80px",
      }}
    >
      <div style={cardStyle}>
        <h2>🪪</h2>
        <h3>PAN Card</h3>
        <p>New & Correction</p>
      </div>

      <div style={cardStyle}>
        <h2>🆔</h2>
        <h3>Aadhaar</h3>
        <p>Update Service</p>
      </div>

      <div style={cardStyle}>
        <h2>📘</h2>
        <h3>Passport</h3>
        <p>Application Help</p>
      </div>

      <div style={cardStyle}>
        <h2>💰</h2>
        <h3>GST</h3>
        <p>Registration</p>
      </div>
    </div>
  );
}

export default Services;