function AIAssistant() {
  return (
    <div
      style={{
        background: "#0F62FE",
        color: "white",
        margin: "60px 20px",
        borderRadius: "20px",
        padding: "50px 30px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "40px",
          marginBottom: "20px",
        }}
      >
        🤖 AI Digital Assistant
      </h2>

      <p
        style={{
          fontSize: "18px",
          maxWidth: "700px",
          margin: "0 auto",
          lineHeight: "30px",
        }}
      >
        Tell our AI what service you need. It will guide you,
        explain required documents, estimated fees, and create
        your service request instantly.
      </p>

      <button
        style={{
          marginTop: "30px",
          padding: "15px 35px",
          borderRadius: "10px",
          border: "none",
          background: "white",
          color: "#0F62FE",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🎤 Talk to AI
      </button>
    </div>
  );
}

export default AIAssistant;