import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';

const CheckoutForm = ({ bookingId, amount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create a payment intent when the component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await api.post(
          '/payments/create-payment-intent',
          { bookingId }
        );
        
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        
        // Handle specific error messages
        if (err.response && err.response.status === 500) {
          if (err.response.data && err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError('Payment system is temporarily unavailable. Please try again later.');
          }
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
        
        onPaymentError(err);
      }
    };

    createPaymentIntent();
  }, [bookingId, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message);
        onPaymentError(paymentError);
      } else {
        // Payment succeeded, confirm it on the server
        try {
          const bookingResponse = await api.post(
            '/bookings/confirm',
            { 
              bookingId: bookingId,
              paymentIntentId: paymentIntent.id 
            }
          );
          
          if (bookingResponse.data && bookingResponse.data.success) {
            onPaymentSuccess(bookingResponse.data.booking);
          } else {
            // Handle case where server confirmation fails
            setError('Payment succeeded but booking confirmation failed. Please contact support.');
            onPaymentError(new Error('Booking confirmation failed'));
          }
        } catch (confirmError) {
          console.error('Error confirming booking:', confirmError);
          setError('Payment succeeded but booking confirmation failed. Please contact support.');
          onPaymentError(confirmError);
        }
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('An error occurred while processing your payment. Please try again.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#424770',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#dc3545',
        iconColor: '#dc3545',
      },
    },
    // Hide postal code field for test cards
    hidePostalCode: true,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-2">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">${amount.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
