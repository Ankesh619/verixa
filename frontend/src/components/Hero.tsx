function Hero() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "50px",
          color: "#0F62FE",
          marginBottom: "20px",
        }}
      >
        AI Powered Digital Services
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#444",
          maxWidth: "700px",
          margin: "auto",
          lineHeight: "32px",
        }}
      >
        One Platform for PAN Card, Aadhaar, Passport,
        GST, Scholarship, Government Services and much more.
      </p>

      <button
        style={{
          marginTop: "35px",
          background: "#0F62FE",
          color: "white",
          border: "none",
          padding: "15px 35px",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🤖 Talk to AI
      </button>
    </div>
  );
}

export default Hero;