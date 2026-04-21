import React from "react";
import { useNotifications } from "../contexts/NotificationsContext";
import "./NotificationPanel.css";

const NotificationPanel = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h3>Notifications</h3>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllAsRead} className="mark-all-btn">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <p className="notif-empty">No notifications</p>
      )}

      {notifications.map(n => (
        <div
          key={n.id}
          className={`notif-item ${n.is_read ? "read" : ""}`}
          onClick={() => {
            markAsRead(n.id);
            onClose?.();
          }}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>
          <span className="notif-time">
            {new Date(n.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
