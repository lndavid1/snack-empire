import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TutorialBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('snack_tutorial_dismissed') === 'true';
  });

  const [step, setStep] = useState(0);

  if (dismissed) return null;

  const steps = [
    {
      title: 'Yo! Chào mừng tới Snack Empire 👋',
      desc: 'Bạn có $500 trong túi, một chiếc xe đẩy vỉa hè và... 0 kinh nghiệm quản trị. Cùng nấu thôi! 🔥'
    },
    {
      title: '1. Nấu & Bán đồ ăn 🍳',
      desc: 'Chạm nút "NẤU & PHỤC VỤ" màu cam trên Quán để bán đồ ăn cho khách hàng đang chờ!'
    },
    {
      title: '2. Mua nguyên liệu 📦',
      desc: 'Món ăn cần bánh mì, thịt, phô mai... Sang tab "Kho Hàng" để nhập hàng hoặc bật Tự Động Nhập.'
    },
    {
      title: '3. Thuê nhân viên tự động 👨‍🍳',
      desc: 'Vào "Thêm" > "Nhân Sự", tuyển Bếp Trưởng Bob và Thu Ngân Linh để quán tự động bán 24/7!'
    },
    {
      title: '4. Lên đời Đế Chế 🚀',
      desc: 'Nâng cấp lên Kiosk, Nhà hàng, Chuỗi cửa hàng và vươn tới Đế chế Sao Hỏa!'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('snack_tutorial_dismissed', 'true');
      setDismissed(true);
    }
  };

  const handleClose = () => {
    localStorage.setItem('snack_tutorial_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="relative mx-3 md:mx-4 mt-2 md:mt-3 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border border-amber-500/40 shadow-xl overflow-hidden">
      <button
        onClick={handleClose}
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center select-none active:scale-90"
        aria-label="Đóng hướng dẫn"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-2.5 md:gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-lg md:text-xl shrink-0">
          🍔
        </div>
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              HƯỚNG DẪN ({step + 1}/{steps.length})
            </span>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-100 leading-tight">
              {steps[step].title}
            </h4>
          </div>
          <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed font-medium">
            {steps[step].desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-5 md:w-6 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 select-none"
        >
          {step === steps.length - 1 ? (
            <>
              Bắt đầu! <CheckCircle2 className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Tiếp <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
