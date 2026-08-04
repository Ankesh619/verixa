function WhyVerixa() {
  return (
    <div
      style={{
        padding: "70px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "38px",
          color: "#0F62FE",
          marginBottom: "20px",
        }}
      >
        Why Choose Verixa?
      </h2>

      <p
        style={{
          maxWidth: "800px",
          margin: "0 auto 40px",
          color: "#555",
          fontSize: "18px",
        }}
      >
        Verixa is your AI-powered digital service platform where you can
        apply for government services, upload documents, track your work,
        and get instant support.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <FeatureCard
          icon="🤖"
          title="AI Assistant"
          text="24x7 AI Support"
        />

        <FeatureCard
          icon="⚡"
          title="Fast Service"
          text="Quick Processing"
        />

        <FeatureCard
          icon="🔒"
          title="Secure"
          text="Your Data is Safe"
        />

        <FeatureCard
          icon="📱"
          title="Online"
          text="Work From Anywhere"
        />
      </div>
    </div>
  );
}

type CardProps = {
  icon: string;
  title: string;
  text: string;
};

function FeatureCard({ icon, title, text }: CardProps) {
  return (
    <div
      style={{
        width: "220px",
        background: "#eef5ff",
        borderRadius: "15px",
        padding: "25px",
      }}
    >
      <div style={{ fontSize: "45px" }}>{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default WhyVerixa;