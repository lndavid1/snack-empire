import React from 'react';

interface InteriorDecor3DProps {
  onSelectDecor?: (decor: { name: string; description: string }) => void;
}

export const InteriorDecor3D: React.FC<InteriorDecor3DProps> = ({ onSelectDecor }) => {
  return (
    <group>
      {/* ---------------------------------------------------- */}
      {/* 1. CONDIMENT & UTENSIL STATION                       */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[1.8, 0, 3.2]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDecor?.({
            name: 'Quầy Tương & Dụng Cụ Ăn Uống',
            description: 'Khu vực tự phục vụ tương ớt, tương cà, khăn giấy, ống hút và tăm cho khách.',
          });
        }}
      >
        {/* Counter Cabinet */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.9, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Counter Top (Stainless Steel) */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[1.16, 0.05, 0.76]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Ketchup & Mustard Sauce Dispensers */}
        <mesh position={[-0.3, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.32]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[-0.1, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.32]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* Napkin Dispenser */}
        <mesh position={[0.2, 1.05, 0]} castShadow>
          <boxGeometry args={[0.2, 0.22, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} />
        </mesh>
      </group>

      {/* ---------------------------------------------------- */}
      {/* 2. RECYCLING & TRASH BIN STATION                    */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[8.6, 0, 6.0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDecor?.({
            name: 'Thùng Rác & Khay Dọn Dẹp',
            description: 'Trạm thu hồi khay ăn và thùng phân loại rác thải tự động giữ vệ sinh quán.',
          });
        }}
      >
        {/* Dual Waste Cabinet */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.1, 0.75]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        {/* Tray Shelf on Top */}
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[1.06, 0.05, 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Flap Doors */}
        {[-0.24, 0.24].map((fx, i) => (
          <mesh key={i} position={[fx, 0.85, 0.38]} castShadow>
            <boxGeometry args={[0.35, 0.28, 0.02]} />
            <meshStandardMaterial color={i === 0 ? '#15803d' : '#0369a1'} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ---------------------------------------------------- */}
      {/* 3. STAFF BREAK & REST FURNITURE                      */}
      {/* ---------------------------------------------------- */}
      <group 
        position={[-7.8, 0, -2.0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDecor?.({
            name: 'Khu Nghỉ Ngơi & Hồi Sức Nhân Viên',
            description: 'Sofa da êm ái, bình nước khoáng mát lạnh và tủ đồ cá nhân giúp nhân viên phục hồi thể lực (+1.5/s).',
          });
        }}
      >
        {/* Comfortable Staff Break Sofa Bench */}
        {/* Seat Cushion */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.24, 0.75]} />
          <meshStandardMaterial color="#312e81" roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.65, -0.32]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.16]} />
          <meshStandardMaterial color="#3730a3" roughness={0.8} />
        </mesh>
        {/* Armrests */}
        {[-0.85, 0.85].map((ax, i) => (
          <mesh key={i} position={[ax, 0.45, 0]} castShadow>
            <boxGeometry args={[0.16, 0.36, 0.75]} />
            <meshStandardMaterial color="#3730a3" roughness={0.8} />
          </mesh>
        ))}

        {/* Water Cooler / Hydration Dispenser */}
        <group position={[-1.3, 0, -1.0]}>
          {/* Base Stand */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.38, 1.0, 0.38]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          {/* Blue Water Bottle on Top */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.5, 16]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} roughness={0.1} />
          </mesh>
        </group>

        {/* Staff Lockers Cabinet */}
        <group position={[-1.3, 0, -2.3]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.45, 2.0, 0.9]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Locker Slits */}
          {[0.5, 1.1, 1.6].map((ly, i) => (
            <mesh key={i} position={[0.23, ly, 0]}>
              <boxGeometry args={[0.02, 0.04, 0.4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------------------------------------------------- */}
      {/* 4. DECORATIVE INDOOR POTTED PLANTS                  */}
      {/* ---------------------------------------------------- */}
      {[
        { pos: [2.5, 0, 6.5] as [number, number, number], name: 'Cây Bàng Singapore Sảnh Đón' },
        { pos: [-8.8, 0, 6.0] as [number, number, number], name: 'Cây Trầu Bà Góc Bàn Ăn' },
        { pos: [8.8, 0, -1.0] as [number, number, number], name: 'Cây Kim Tiền Quầy Thu Ngân' },
      ].map((plant, idx) => (
        <group 
          key={idx} 
          position={plant.pos}
          onClick={(e) => {
            e.stopPropagation();
            onSelectDecor?.({
              name: plant.name,
              description: 'Cây cảnh xanh mát tạo không khí thoáng đãng, dễ chịu cho khách hàng và nhân viên.',
            });
          }}
        >
          {/* Ceramic Pot */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.18, 0.6, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Plant Trunk */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Foliage Leaf Clusters */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          <mesh position={[0.1, 1.3, -0.05]} castShadow>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
