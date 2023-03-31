import { useState, useEffect } from "react";
import StripeCheckout from 'react-stripe-checkout';


const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order has expired</div>
  }
  
  return (
    <div>
      Order expires: {timeLeft} seconds
      <StripeCheckout 
        token={(token) => console.log(token)} 
        stripeKey="pk_test_51MrSXlFFLuJmXinVExAWQWnrdyl6AjegRppYFdRs1eCtOzkn9jKnld6V84l3EjX5SfFp9qr6RcgeTnnHsuuG7sDX00HG9J0a4A"
        amount={order.record.price * 100}
        email={currentUser.email}
        />
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;