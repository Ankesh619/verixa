function Footer() {
  return (
    <footer
      style={{
        background: "#1e293b",
        color: "white",
        padding: "50px 30px",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div>
          <h2 style={{ color: "#60a5fa" }}>VERIXA</h2>
          <p>AI Powered Digital Service Platform</p>
          <p>Making Government Services Easy.</p>
        </div>

        <div>
          <h3>Services</h3>
          <p>PAN Card</p>
          <p>Aadhaar</p>
          <p>Passport</p>
          <p>GST</p>
        </div>

        <div>
          <h3>Support</h3>
          <p>Help Center</p>
          <p>Track Application</p>
          <p>Contact Us</p>
          <p>Privacy Policy</p>
        </div>

        <div>
          <h3>Coming Soon</h3>
          <p>🤖 AI Voice</p>
          <p>📱 Android App</p>
          <p>💬 WhatsApp Bot</p>
          <p>📊 Dashboard</p>
        </div>
      </div>

      <hr style={{ margin: "30px 0", borderColor: "#475569" }} />

      <p style={{ textAlign: "center" }}>
        © 2026 Verixa. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;