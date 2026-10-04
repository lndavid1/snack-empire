import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

interface WebGLFallbackProps {
  onBackTo2D: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ onBackTo2D }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto">
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
      </div>

      <h3 className="text-lg font-black text-slate-100 mb-2">
        WebGL Không Khả Dụng Trên Thiết Bị Này
      </h3>

      <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed max-w-md">
        Trình duyệt hoặc phần cứng của bạn hiện chưa kích hoạt tăng tốc phần cứng WebGL. 
        Bạn vẫn có thể tiếp tục quản lý và vận hành toàn bộ nhà hàng trơn tru qua giao diện 2D!
      </p>

      <button
        onClick={onBackTo2D}
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-lg transition-transform active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>Quay Lại Giao Diện Quản Lý 2D</span>
      </button>
    </div>
  );
};
