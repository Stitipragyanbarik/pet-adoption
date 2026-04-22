import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../config/api";

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { user, token, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch notifications (authenticated)
   */
  const fetchNotifications = async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);

      // If token is invalid/expired → logout user
      if (err.response?.status === 401) {
        logout?.();
      }

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark a single notification as read
   */
  const markAsRead = async (id) => {
    if (!token) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/notifications/${id}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read failed", err);

      if (err.response?.status === 401) {
        logout?.();
      }
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/notifications/read-all/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("Mark all as read failed", err);

      if (err.response?.status === 401) {
        logout?.();
      }
    }
  };

  /**
   * Auto-fetch notifications when user/token changes
   */
  useEffect(() => {
    if (!user || !token) {
      setNotifications([]);
      return;
    }

    fetchNotifications();
  }, [user, token]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
