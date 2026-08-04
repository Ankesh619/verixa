import {
  User,
  FileText,
  CreditCard,
  Bell,
  Settings,
} from "lucide-react";

function Dashboard() {
  const cards = [
    {
      title: "My Profile",
      icon: <User size={40} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "My Applications",
      icon: <FileText size={40} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Payments",
      icon: <CreditCard size={40} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Notifications",
      icon: <Bell size={40} />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Settings",
      icon: <Settings size={40} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome to VERIXA
        </h1>

        <p className="mt-2">
          Manage all your government services from one place.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto p-8 grid md:grid-cols-3 gap-6">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.color}`}
            >
              {card.icon}
            </div>

            <h2 className="text-xl font-bold mt-6">
              {card.title}
            </h2>

            <p className="text-gray-500 mt-2">
              Click to open {card.title}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;