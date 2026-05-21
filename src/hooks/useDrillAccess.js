import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  DRILL_COUNTS,
  DRILL_TIER,
  getDrillsForTier,
} from '../constants/practiceDrills';

/**
 * Resolve Classic (9) vs Pro (13) drill library from subscription.
 * Falls back to Classic when plan is unknown (dev / logged-out preview).
 */
export function useDrillAccess() {
  const { user } = useSelector(state => state.app);

  const tier = useMemo(() => {
    const plan = (
      user?.subscription_plan ||
      user?.package_name ||
      user?.plan_name ||
      user?.membership ||
      ''
    )
      .toString()
      .toLowerCase();
    if (plan.includes('pro')) {
      return DRILL_TIER.pro;
    }
    return DRILL_TIER.classic;
  }, [user]);

  const drills = useMemo(() => getDrillsForTier(tier), [tier]);
  const isPro = tier === DRILL_TIER.pro;

  return {
    tier,
    isPro,
    drills,
    classicCount: DRILL_COUNTS.classic,
    proCount: DRILL_COUNTS.pro,
    canAccessDrill: drill => isPro || drill.tier === DRILL_TIER.classic,
  };
}
