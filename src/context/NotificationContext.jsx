import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCloudNotifications, markCloudNotificationRead, sendCloudNotification } from '../services/cloudStorage';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadNotifications = async (userId) => {
    if (!userId) return;
    const notifs = await getCloudNotifications(userId);
    setNotifications(notifs);
  };

  const markAsRead = async (id) => {
    await markCloudNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const triggerNotification = async (notifData) => {
    const newNotif = await sendCloudNotification(notifData);
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifications,
        loadNotifications,
        markAsRead,
        triggerNotification,
        unreadCount: notifications.filter(n => !n.read).length,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
