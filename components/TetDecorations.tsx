
import React from 'react';

export const TetDecorations = () => {
  // Generate random petals for animation
  const petals = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`, // Random horizontal position
    animationDuration: `${Math.random() * 8 + 5}s`, // Random speed
    animationDelay: `${Math.random() * 5}s`,
    scale: Math.random() * 0.5 + 0.5
  }));

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-50 overflow-visible">
      
      {/* Falling Petals Layer (Full Screen height relative to viewport via sticky header) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden pointer-events-none z-0 opacity-50">
         {petals.map(p => (
             <div 
                key={p.id}
                className="absolute top-[-20px] text-pink-300 animate-fall"
                style={{
                    left: p.left,
                    animationDuration: p.animationDuration,
                    animationDelay: p.animationDelay,
                    transform: `scale(${p.scale})`
                }}
             >
                 <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                     <path d="M5 0 C2 2 0 5 0 5 C0 5 2 8 5 10 C8 8 10 5 10 5 C10 5 8 2 5 0 Z" />
                 </svg>
             </div>
         ))}
      </div>

      {/* Container for Branches */}
      <div className="relative w-full h-40 md:h-64 overflow-hidden">
          {/* LEFT BRANCH */}
          <div className="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 animate-sway origin-top-left z-10">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              {/* Wood Branch */}
              <path d="M0,0 Q60,10 100,60 T160,160" fill="none" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
              <path d="M100,60 Q140,40 180,50" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" />
              <path d="M50,20 Q80,80 70,120" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
              
              {/* Blossoms (Pink) */}
              <g fill="#FF80AB">
                 <circle cx="100" cy="60" r="8" />
                 <circle cx="160" cy="160" r="9" />
                 <circle cx="180" cy="50" r="7" />
                 <circle cx="70" cy="120" r="6" />
                 <circle cx="130" cy="100" r="5" />
                 <circle cx="30" cy="15" r="6" />
                 <circle cx="200" cy="140" r="5" opacity="0.8" />
              </g>
              {/* Buds (Darker Pink) */}
              <g fill="#F06292">
                 <circle cx="170" cy="150" r="4" />
                 <circle cx="190" cy="40" r="4" />
                 <circle cx="80" cy="130" r="4" />
              </g>
              {/* Leaves (Green) */}
              <g fill="#9CCC65">
                 <path d="M110,65 Q120,60 115,75 Z" />
                 <path d="M150,150 Q160,145 155,160 Z" />
                 <path d="M60,110 Q70,105 65,120 Z" />
              </g>
              
              {/* Hanging Lucky Money (Li Xi) */}
              <g transform="translate(160, 160) rotate(15)">
                 <line x1="0" y1="0" x2="0" y2="30" stroke="#C62828" strokeWidth="1.5" />
                 <rect x="-12" y="30" width="24" height="36" fill="#D32F2F" rx="2" stroke="#B71C1C" strokeWidth="1"/>
                 <rect x="-8" y="35" width="16" height="16" fill="#FFD700" rx="1" opacity="0.9"/>
                 <text x="-8" y="60" fontSize="10" fill="#FFD700" fontWeight="bold" fontFamily="serif">TẾT</text>
              </g>
            </svg>
          </div>

          {/* RIGHT BRANCH */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-80 md:h-80 animate-sway-reverse origin-top-right z-10">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md" style={{ transform: 'scaleX(-1)' }}>
               {/* Main Branch */}
              <path d="M0,0 Q70,15 110,70 T170,170" fill="none" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
              <path d="M110,70 Q150,50 190,60" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" />
              <path d="M50,25 Q80,90 70,130" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
              <path d="M170,170 Q200,190 220,180" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
              
              {/* Blossoms */}
              <g fill="#FF80AB">
                 <circle cx="110" cy="70" r="8" />
                 <circle cx="170" cy="170" r="9" />
                 <circle cx="190" cy="60" r="7" />
                 <circle cx="70" cy="130" r="6" />
                 <circle cx="140" cy="110" r="5" />
                 <circle cx="90" cy="40" r="6" />
                 <circle cx="220" cy="180" r="6" />
              </g>
               {/* Buds */}
              <g fill="#F06292">
                 <circle cx="180" cy="160" r="4" />
                 <circle cx="200" cy="50" r="4" />
                 <circle cx="80" cy="140" r="4" />
                 <circle cx="230" cy="175" r="3" />
              </g>
               {/* Leaves */}
              <g fill="#9CCC65">
                 <path d="M120,75 Q130,70 125,85 Z" />
                 <path d="M160,160 Q170,155 165,170 Z" />
              </g>

               {/* Hanging Lantern */}
               <g transform="translate(110, 70) rotate(-10)">
                 <line x1="0" y1="0" x2="0" y2="40" stroke="#C62828" strokeWidth="1.5" />
                 <path d="M0,40 Q-15,40 -15,55 Q-15,70 0,70 Q15,70 15,55 Q15,40 0,40 Z" fill="#D32F2F" />
                 <rect x="-6" y="38" width="12" height="4" fill="#3E2723" />
                 <rect x="-6" y="68" width="12" height="4" fill="#3E2723" />
                 {/* Tassel */}
                 <line x1="0" y1="72" x2="0" y2="95" stroke="#D32F2F" strokeWidth="2" />
                 <line x1="-3" y1="72" x2="-5" y2="90" stroke="#EF5350" strokeWidth="1" />
                 <line x1="3" y1="72" x2="5" y2="90" stroke="#EF5350" strokeWidth="1" />
              </g>
            </svg>
          </div>
      </div>
      
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes sway-reverse {
          0%, 100% { transform: scaleX(-1) rotate(0deg); }
          50% { transform: scaleX(-1) rotate(3deg); }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-sway {
          animation: sway 6s ease-in-out infinite;
        }
        .animate-sway-reverse {
          animation: sway-reverse 7s ease-in-out infinite;
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
