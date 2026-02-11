/**
 * FEATURES USAGE PATTERN
 * 
 * Throughout the app, use this pattern to show/hide features based on user's plan:
 */

import { getFeaturesFromStorage, hasFeature } from "@/lib/useFeaturesStore";

/**
 * PATTERN 1: In Server/Static Components (Pre-render)
 * Get features at build time (limited use)
 */
// const features = getFeaturesFromStorage();

/**
 * PATTERN 2: In Client Components (Recommended)
 */
// "use client";
// import { useEffect, useState } from "react";
// import { getFeaturesFromStorage } from "@/lib/useFeaturesStore";

// export function MyComponent() {
//   const [features, setFeatures] = useState(null);
//   
//   useEffect(() => {
//     const stored = getFeaturesFromStorage();
//     setFeatures(stored);
//   }, []);
//   
//   if (!features) return <div>Loading...</div>;
//   
//   return (
//     <>
//       {features.memory_v2 ? (
//         <div>✨ Memory feature available!</div>
//       ) : (
//         <div>
//           <p>Upgrade to Pro to unlock memory.</p>
//           <a href="/pricing">View pricing →</a>
//         </div>
//       )}
//     </>
//   );
// }

/**
 * PATTERN 3: Check Specific Feature
 */
// if (hasFeature('memory_v2')) {
//   // Show memory feature
// } else {
//   // Show upgrade CTA
// }

/**
 * FEATURES AVAILABLE:
 * - memory_v2: Long-term memory (Pro+)
 * - advanced_analytics: Analytics dashboard (Business)
 * - priority_support: Priority email support (Business)
 * - custom_automations: Custom automation rules (Pro+)
 */
