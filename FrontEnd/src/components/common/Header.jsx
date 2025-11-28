import { NavLink, useNavigate } from "react-router";
import { FaHome, FaUser, FaBell, FaCog, FaBook } from "react-icons/fa";
import { CiWheat, CiLogout } from "react-icons/ci";
import { MdMan, MdInsertPageBreak, MdWebAsset } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { GrSchedule } from "react-icons/gr";
import { useAuth } from "../../context/AuthContext"; 




export default function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const basePath = user?.role === "admin" ? "admin" : "staff";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Admin helper: redirect to staff pages; if not logged in, force login first
  const requireLoginAndRedirect = (targetPath) => {
    if (!user) {
      // not logged in -> go to login page first
      navigate("/login");
      return;
    }
    navigate(targetPath);
  };

  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col px-4 py-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-8 capitalize">
        {user?.role ?? "User"} Dashboard
      </h1>
      <nav className="flex flex-col gap-2">
        <NavLink
          to={`/${basePath}/dashboard`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaHome /> Overview
        </NavLink>

        <NavLink
          to={`/${basePath}/farmers`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <CiWheat /> Farmers
        </NavLink>

        <NavLink
          to={`/${basePath}/booking-management`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaBook /> Booking Form
        </NavLink>

        <NavLink
          to={`/${basePath}/labor`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <MdMan /> Labour
        </NavLink>

        {/* Expenses: show normal navlink + admin-only button to open staff expenses */}
        <div className="flex items-center justify-between px-0">
          <NavLink
            to={`/${basePath}/expencess`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg w-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <MdInsertPageBreak /> Expenses
          </NavLink>

          {user?.role === "admin" && (
            <button
              onClick={() => requireLoginAndRedirect("/staff/expencess")}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              title="Open Staff Expenses"
            >
              Staff
            </button>
          )}
        </div>

        <NavLink
          to={`/${basePath}/assets`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <MdWebAsset /> Assets
        </NavLink>

        {/* Schedule: normal navlink + admin-only button to open staff schedule */}
        <div className="flex items-center justify-between px-0">
          <NavLink
            to={`/${basePath}/schedule`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg w-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <GrSchedule /> Schedule
          </NavLink>

          {user?.role === "admin" && (
            <button
              onClick={() => requireLoginAndRedirect("/staff/schedule")}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              title="Open Staff Schedule"
            >
              Staff
            </button>
          )}
        </div>

        <NavLink
          to={`/${basePath}/newpage`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaNewspaper /> New Entry
        </NavLink>

        <NavLink
          to={`/${basePath}/notifications`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaBell /> Notifications
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
        >
          <CiLogout /> Logout
        </button>
      </nav>
    </div>
  );
}
