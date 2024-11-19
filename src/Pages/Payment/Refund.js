const processRefund = async (sessionId, amount = null) => {
    try {
      const response = await fetch('/create-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          amount: amount // Optional: include for partial refund
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        console.log('Refund processed successfully');
        // Update your UI or order status here
      }
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };
  
//   // Example usage:
//   // Full refund:
//   processRefund('cs_test_...');
//   // Partial refund (e.g., $10):
//   processRefund('cs_test_...', 10);