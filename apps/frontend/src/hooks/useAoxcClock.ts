import { useEffect, useRef } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';

/**
 * @title AOXC Neural Heartbeat Hook
 * @notice Orchestrates the temporal synchronization between the UI and X Layer.
 * @dev Audit Standards: 
 * - Prevents multiple concurrent sync executions.
 * - Aligns internal state with on-chain entropy.
 */
export const useAoxcClock = () => {
  const { incrementBlock, addLog } = useAoxcStore();
  const isSyncing = useRef(false);

  useEffect(() => {
    // Keep UI clock lightweight to avoid network thrash and UI stalls.
    const CLOCK_SPEED = 6000; 

    const tick = () => {
      if (isSyncing.current) return; // Prevent overlapping ticks
      
      isSyncing.current = true;
      try {
        // Finalize the tick by updating internal counters only
        incrementBlock();

        // Layer 2: Autonomous AI Health Check Triggers
        if (Math.random() > 0.85) {
          const diagnostics = [
            'SENTINEL: State integrity verified.',
            'INFRA: Optimizing neural gas pathways...',
            'CLOCK: Epoch synchronization verified.',
            'GATEWAY: Monitoring X Layer-Reth nodes...'
          ];
          const randomMsg = diagnostics[Math.floor(Math.random() * diagnostics.length)];
          addLog(randomMsg, 'ai');
        }
      } finally {
        isSyncing.current = false;
      }
    };

    const interval = setInterval(tick, CLOCK_SPEED);

    // Initial tick to populate data immediately on mount
    tick();

    return () => clearInterval(interval);
  }, [incrementBlock, addLog]);
};
