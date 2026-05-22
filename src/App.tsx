/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import PhonicsGameBoard from './components/PhonicsGameBoard.tsx';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#f4f3e6] flex items-center justify-center p-0 md:p-4 overflow-hidden select-none">
      <div className="w-full max-w-[1024px] h-screen md:h-[736px] bg-[#fdfcf0] md:rounded-[32px] md:shadow-2xl overflow-hidden flex flex-col border border-[#3d405b]/10 relative">
        <PhonicsGameBoard />
      </div>
    </div>
  );
}
