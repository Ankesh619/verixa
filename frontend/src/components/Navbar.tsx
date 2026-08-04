function Navbar() {
  return (
    <nav
      style={{
        background: "#0F62FE",
        color: "white",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>VERIXA</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <span>Home</span>
        <span>Services</span>
        <span>Track</span>
        <span>Contact</span>
      </div>
    </nav>
  );
}

export default Navbar;