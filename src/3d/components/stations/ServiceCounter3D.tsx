import React from 'react';
import { RESTAURANT_LAYOUT } from '../../config/restaurantLayout';
import type { ReadyItem3DState } from '../../types/sceneTypes';

interface ServiceCounter3DProps {
  readyItems: ReadyItem3DState[];
  onSelectCounterPoint?: (point: { name: string; type: string; description: string }) => void;
}

export const ServiceCounter3D: React.FC<ServiceCounter3DProps> = ({ 
  readyItems, 
  onSelectCounterPoint 
}) => {
  const [x, y, z] = RESTAURANT_LAYOUT.serviceCounter.position;

  return (
    <group position={[x, y, z]}>
      {/* 1. Main Counter Base (Dark Slate Cabinet with Brass Kickplate) */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.0, 0.95]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      {/* Brass Kickplate */}
      <mesh position={[0, 0.05, 0.48]}>
        <boxGeometry args={[4.8, 0.1, 0.02]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. Countertop Slab (Polished Maple Hardwood) */}
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.08, 1.15]} />
        <meshStandardMaterial color="#d97706" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* ---------------------------------------------------- */}
      {/* SECTION A: ORDER POINT (LEFT: X = -1.6)              */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[-1.6, 1.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCounterPoint?.({
            name: 'Điểm Đặt Món (Order Point)',
            type: 'ORDER',
            description: 'Nơi khách hàng xếp hàng chọn món ăn trong menu và gửi đơn vào bếp.',
          });
        }}
      >
        {/* POS Cash Register Terminal */}
        <group position={[0, 0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.14, 0.38]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Touchscreen Monitor */}
          <mesh position={[0, 0.2, 0.06]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.34, 0.24, 0.04]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
          </mesh>
          {/* Order Sign Label */}
          <mesh position={[0, 0.38, 0.06]}>
            <boxGeometry args={[0.26, 0.06, 0.02]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </group>

      {/* ---------------------------------------------------- */}
      {/* SECTION B: PAYMENT POINT (CENTER: X = 0)             */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[0, 1.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCounterPoint?.({
            name: 'Điểm Thanh Toán (Payment Point)',
            type: 'PAYMENT',
            description: 'Khu vực quẹt thẻ, quét mã QR và thu tiền mặt của khách.',
          });
        }}
      >
        {/* Card Reader / QR Scanner Terminal */}
        <mesh position={[0, 0.08, 0.15]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>
        {/* Contactless NFC Glowing Chip */}
        <mesh position={[0, 0.14, 0.15]} rotation={[-0.4, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ---------------------------------------------------- */}
      {/* SECTION C: PICKUP POINT (RIGHT: X = 1.6)             */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[1.6, 1.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCounterPoint?.({
            name: 'Điểm Nhận Món (Pickup Point)',
            type: 'PICKUP',
            description: 'Khay inox bưng món ăn nóng hổi vừa nấu xong cho khách hàng.',
          });
        }}
      >
        {/* Stainless Steel Serving Tray Hatch */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.03, 0.7]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Counter Service Bell */}
        <group position={[-0.45, 0.06, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.06]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>
        </group>

        {/* Ready Food Platters Display */}
        {readyItems.map((item, idx) => {
          const itemX = -0.2 + (idx % 2) * 0.35;
          const itemZ = (Math.floor(idx / 2) * 0.25) - 0.15;
          return (
            <group key={item.id} position={[itemX, 0.08, itemZ]}>
              {/* Food Box / Carton */}
              <mesh castShadow>
                <boxGeometry args={[0.26, 0.18, 0.2]} />
                <meshStandardMaterial color="#ef4444" roughness={0.8} />
              </mesh>
              {/* Golden Fries sticking out */}
              <mesh position={[0, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.1]} />
                <meshStandardMaterial color="#eab308" roughness={0.9} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
