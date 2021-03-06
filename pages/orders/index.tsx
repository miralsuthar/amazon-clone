import React, { useEffect } from 'react';
import { getOrders, getListingData } from '../api/orders';
import { getListingImages } from '../api/listings';
import { OrderCard } from '../../components/OrderCard';

const Index = ({ orders }: { orders: any }) => {
  useEffect(() => {
    Promise.all(
      orders.map(async (order: any) => {
        const { data, error } = await getListingData(order.listing_id);

        if (!error && data) {
          order.listingData = data;
        }
      })
    );
  }, [orders]);

  return (
    <div>
      <h2 className='mt-2 mb-4 text-lg font-semibold'>Orders</h2>

      <div className=' grid lg:grid-cols-3 flex-col gap-2 justify-items-stretch'>
        {orders &&
          // @ts-ignore
          orders.map((order, index) => {
            console.log('order from orders.tsx: ', order);
            return (
              <div key={index} className=''>
                <OrderCard
                  image={order.image}
                  id={order.id}
                  customerEmail={order.customer_email}
                  shippingCode={order.shipping_to_pincode}
                  qty={order.qty}
                  title={order.listingData.title}
                  paymentDone={order.payment_done}
                  deliveryDone={order.delivery_done}
                  sku={order.listingData.sku}
                  payableAmount={order.payable_amount}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { orders } = await getOrders();

  for await (let order of orders!) {
    const { data } = await getListingData(order.listing_id);
    const images = await getListingImages(data);
    if (images[0] === undefined) {
      order.image = '';
    } else {
      order.image = images[0];
    }

    console.log('images: ', order.image);
    order.listingData = data;
  }

  return {
    props: {
      orders,
    },
  };
}

export default Index;
