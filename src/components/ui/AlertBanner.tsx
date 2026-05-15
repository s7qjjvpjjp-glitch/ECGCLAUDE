interface AlertBannerProps {
  type: 'error' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
}

const CONFIG = {
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-400 text-amber-900',
  info: 'bg-sky-100 text-sky-800 border border-sky-200',
};

export function AlertBanner({ type, message, onDismiss }: AlertBannerProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${CONFIG[type]}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-3 opacity-70 hover:opacity-100 text-lg leading-none">
          ×
        </button>
      )}
    </div>
  );
}
