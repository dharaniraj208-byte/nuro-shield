import React from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Pill,
  Activity,
  HeartPulse,
  Info
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNeuro();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'MEDICINE':
        return <Pill className="h-4 w-4 text-sky-500" />;
      case 'EXERCISE':
        return <Activity className="h-4 w-4 text-teal-500" />;
      case 'VITALS':
        return <HeartPulse className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-sm sm:max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-top-4 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications &amp; Alerts
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {unreadNotificationCount} unread updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline px-2 py-1 rounded"
                title="Mark all as read"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  item.unread
                    ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/60'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {item.unread && (
                  <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
