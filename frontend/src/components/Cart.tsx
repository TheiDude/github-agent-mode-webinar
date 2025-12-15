import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const orderDetails = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      await axios.post('/api/orders', {
        branchId: 1, // Default to branch 1; can be made dynamic with branch context
        status: 'pending',
        orderDetails,
      });

      setMessage({ type: 'success', text: 'Order submitted successfully!' });
      clearCart();
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit order:', error);
      setMessage({
        type: 'error',
        text: 'Failed to submit order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal();

  if (items.length === 0 && !message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => {
                    const discount = item.discountPercentage || 0;
                    const priceAfterDiscount = item.price * (1 - discount / 100);
                    const itemTotal = priceAfterDiscount * item.quantity;

                    return (
                      <tr key={item.productId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.name}
                          {discount > 0 && (
                            <span className="ml-2 text-xs font-semibold text-red-600 dark:text-red-400">
                              -{discount}%
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                          {discount > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 line-through">
                              ${item.price.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.productId, item.quantity - 1)
                              }
                              className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(item.productId, item.quantity + 1)
                              }
                              className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          ${itemTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-full md:w-80">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Checkout'}
                    </button>
                    <button
                      onClick={() => navigate('/products')}
                      className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full px-6 py-3 text-red-600 dark:text-red-400 font-semibold hover:text-red-800 dark:hover:text-red-300 transition"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
