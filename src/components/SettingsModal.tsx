import React, { useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    soundEnabled,
    toggleSound,
    saveGame,
    exportSaveData,
    importSaveData,
    resetGameData
  } = useGameStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleManualSave = () => {
    saveGame();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importSaveData(content);
      if (!success) {
        setImportError('File save không hợp lệ!');
      } else {
        setImportError(null);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    if (window.confirm('⚠️ BẠN CÓ CHẮC CHẮN MUỐN RESET TOÀN BỘ DỮ LIỆU?\n\nMọi tiến trình, tiền bạc và cửa hàng sẽ bị xóa hoàn toàn!')) {
      resetGameData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center select-none active:scale-95"
          aria-label="Đóng cài đặt"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base md:text-lg font-black text-slate-100 mb-1 flex items-center gap-2">
          ⚙️ CÀI ĐẶT & HỆ THỐNG
        </h3>
        <p className="text-[11px] md:text-xs text-slate-400 font-medium mb-4">
          Quản lý âm thanh, sao lưu và dữ liệu trò chơi.
        </p>

        <div className="space-y-2.5 mb-5">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400 shrink-0" /> : <VolumeX className="w-5 h-5 text-slate-400 shrink-0" />}
              <div>
                <div className="text-xs md:text-sm font-bold text-slate-200">Hiệu Ứng Âm Thanh</div>
                <div className="text-[10px] md:text-[11px] text-slate-400">Click, ting ting tiền, chuông nâng cấp</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors select-none active:scale-95 shrink-0 ${
                soundEnabled 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {soundEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Manual Save */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Save className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs md:text-sm font-bold text-slate-200">Lưu Tiến Trình Thủ Công</div>
                <div className="text-[10px] md:text-[11px] text-slate-400">Game tự động lưu mỗi 10 giây</div>
              </div>
            </div>
            <button
              onClick={handleManualSave}
              className="min-h-[40px] flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors select-none active:scale-95 shrink-0"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã lưu!</span>
                </>
              ) : (
                'Lưu ngay'
              )}
            </button>
          </div>

          {/* Export / Import Save Data */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportSaveData}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all select-none active:scale-95 text-center"
            >
              <Download className="w-4 h-4 text-sky-400 shrink-0" /> Xuất File Save
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all select-none active:scale-95 text-center"
            >
              <Upload className="w-4 h-4 text-purple-400 shrink-0" /> Nhập File Save
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {importError && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Reset Game */}
          <div className="pt-1">
            <button
              onClick={handleConfirmReset}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all select-none active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Reset Game Về Ban Đầu
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] md:text-[11px] text-slate-500 font-medium">
          Snack Empire • Gen Z Tycoon Game
        </div>
      </div>
    </div>
  );
};
