import { Bell } from "lucide-react";
import { useNotifications } from "../contexts/NotificationsContext";
import { useState, useRef, useEffect } from "react";
import NotificationPanel from "./NotificationPanel";

const NotificationBell = () => {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const unread = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notif-wrapper" ref={wrapperRef}>
      <div className="icon-btn"
      role="button" tabIndex={0}
      onClick={() => setOpen(prev => !prev)}>
  <Bell size={20} />
  {unread > 0 && <span className="notif-badge">{unread}</span>}
</div>


      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
