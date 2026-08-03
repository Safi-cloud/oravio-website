export default function CloudField({ variant = "light" }: { variant?: "light" | "dark" }) {
  if (variant === "dark") {
    return (
      <div className="cloud-field">
        <div
          className="cloud-blob cloud-drift"
          style={{ width: 460, height: 460, top: -120, left: "10%", background: "#2f6fa8" }}
        />
        <div
          className="cloud-blob cloud-drift-slow"
          style={{ width: 380, height: 380, bottom: -140, right: "5%", background: "#1d6e7d", opacity: 0.4 }}
        />
        <div
          className="cloud-blob cloud-drift"
          style={{ width: 260, height: 260, top: "30%", right: "20%", background: "#2f9e6e", opacity: 0.22 }}
        />
      </div>
    );
  }

  return (
    <div className="cloud-field">
      <div
        className="cloud-blob cloud-drift"
        style={{ width: 520, height: 520, top: -180, left: "-8%", background: "#cfe3f7" }}
      />
      <div
        className="cloud-blob cloud-drift-slow"
        style={{ width: 420, height: 420, top: -80, right: "-10%", background: "#d7ece4" }}
      />
      <div
        className="cloud-blob cloud-drift"
        style={{ width: 300, height: 300, bottom: -160, left: "30%", background: "#e2eefb", opacity: 0.7 }}
      />
    </div>
  );
}
