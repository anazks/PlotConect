import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Function to load script and append in DOM tree.
const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('Razorpay loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.log('Error loading Razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });

const RenderRazorpay = ({ orderId, currency, amount, user }) => {
    console.log(orderId, "rzp_test_1XVQVdAljbnAgC", currency, amount, user,'RenderRazorpay component mounted');
  const paymentId = useRef(null);
  const paymentMethod = useRef(null);

  // Informing the server about the payment
  const handlePayment = async (status, orderDetails = {}) => {
    try {
      await axios.post(
        '/api/orders/paymentStatus',
        {
          status,
          orderDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error sending payment status to server:', error);
    }
  };

  // Razorpay options
  const options = {
    key: "rzp_test_1XVQVdAljbnAgC",
    amount: amount,
    currency: currency,
    order_id: orderId,
    name: 'Auction Payment',
    description: 'Payment for your winning bid',
    handler: function (response) {
      console.log('Payment successful:', response);
      handlePayment('success', response);
    },
    prefill: {
      name: user?.name || 'User',
      email: user?.email || 'email@example.com',
    },
    theme: {
      color: '#00bcd4',
    },
    modal: {
      ondismiss: function () {
        handlePayment('cancelled');
      },
    },
  };

  // Load and open Razorpay modal
  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      console.log('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const rzp1 = new window.Razorpay(options);

    rzp1.on('payment.submit', (response) => {
      paymentMethod.current = response.method;
    });

    rzp1.on('payment.failed', (response) => {
      paymentId.current = response.error.metadata.payment_id;
      handlePayment('failed', response.error);
    });

    rzp1.open();
  };

  useEffect(() => {
    displayRazorpay();
  }, []);

  return null;
};

RenderRazorpay.propTypes = {
  orderId: PropTypes.string.isRequired,
  keyId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default RenderRazorpay;
