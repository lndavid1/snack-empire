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
        setImportError('File save không hợp lệ hoặc bị lỗi định dạng!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-slate-100 mb-1 flex items-center gap-2">
          ⚙️ CÀI ĐẶT & HỆ THỐNG
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-5">
          Quản lý âm thanh, lưu trữ dữ liệu đám mây / sao lưu máy tính.
        </p>

        <div className="space-y-3 mb-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <div>
                <div className="text-sm font-bold text-slate-200">Hiệu Ứng Âm Thanh</div>
                <div className="text-[11px] text-slate-400">Âm thanh click, ting ting nhận tiền, chuông nâng cấp</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                soundEnabled 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {soundEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Manual Save */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Save className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-slate-200">Lưu Tiến Trình Thủ Công</div>
                <div className="text-[11px] text-slate-400">Game tự động lưu mỗi 10 giây</div>
              </div>
            </div>
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors"
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
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-sky-400" /> Xuất File Save (.json)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <Upload className="w-4 h-4 text-purple-400" /> Nhập File Save
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
          <div className="pt-2">
            <button
              onClick={handleConfirmReset}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset Toàn Bộ Game Về Ban Đầu
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 font-medium">
          Snack Empire v1.0.0 • Made with ❤️ for Gen Z Tycoons
        </div>
      </div>
    </div>
  );
};
