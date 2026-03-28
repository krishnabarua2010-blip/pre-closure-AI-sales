// src/lib/razorpay.ts
import api from './api';

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleUpgrade = async (plan: 'growth' | 'pro', onSuccess: () => void, onError?: (err: any) => void) => {
  const loaded = await loadRazorpay();
  if (!loaded) {
    alert('Razorpay SDK failed to load. Are you online?');
    if (onError) onError(new Error("SDK load failed"));
    return;
  }

  try {
    const { data: order } = await api.post('/payment/create-subscription', { plan });

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SWITmU11YHcu9g';

    const options = {
      key: keyId,
      subscription_id: order.subscription_id,
      name: 'Pre-Closer AI',
      description: `Upgrade to ${plan.toUpperCase()}`,
      handler: async function (response: any) {
        try {
          await api.post('/payment/verify-subscription', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          // Update local storage so the UI unlocks
          const userData = localStorage.getItem('user_data');
          if (userData) {
             const user = JSON.parse(userData);
             user.plan = plan.toUpperCase();
             localStorage.setItem('user_data', JSON.stringify(user));
          }
          
          onSuccess();
        } catch (err) {
          console.error("Verification failed", err);
          alert('Payment verification failed. Please contact support.');
          if (onError) onError(err);
        }
      },
      prefill: {},
      theme: {
        color: '#6366F1',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error(response.error);
      if (onError) onError(response.error);
    });

    rzp.open();

  } catch (error) {
    console.error('Subscription error', error);
    alert('Failed to initiate subscription. Please try again.');
    if (onError) onError(error);
  }
};
