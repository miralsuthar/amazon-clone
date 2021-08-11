import { Button } from '@supabase/ui';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import easyinvoice from 'easyinvoice';
import { getListingImages } from '../../api/listings';
import {
  getListingData,
  getOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
} from '../../api/orders';
import { OrderCard } from '../../../components/OrderCard';

const Index = ({ orders }: { orders: any }) => {
  const router = useRouter();
  const id = router.query.id;

  let invoiceDetail: any;

  useEffect(() => {
    orders
      .filter((order: any) => order.id === id)
      .map((order: any) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        invoiceDetail = {
          //"documentTitle": "RECEIPT", //Defaults to INVOICE
          //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
          currency: 'USD', //See documentation 'Locales and Currency' for more info
          marginTop: 25,
          marginRight: 25,
          marginLeft: 25,
          marginBottom: 25,
          // "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
          // // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
          // "sender": {
          //     "company": "Sample Corp",
          //     "address": "Sample Street 123",
          //     "zip": "1234 AB",
          //     "city": "Sampletown",
          //     "country": "Samplecountry"
          // },
          client: {
            company: order.customer_email,
            zip: order.customer_zip,
            //"custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
          },
          invoiceNumber: order.id,
          invoiceDate: order.created_at,
          products: [
            {
              quantity: order.qty,
              // "tax": 6,
              price: order.price,
              amount: order.payable_amount,
            },
          ],
          // "bottomNotice": "Kindly pay your invoice within 15 days.",
        };
      });
  }, [orders]);

  return (
    <div className="mx-24 ">
      {orders
        .filter((order: any) => order.id === id)
        .map((order: any) => (
          <div key={order.id}>
            {console.log('order: ', order.delivery_done)}
            <OrderCard
              image={order.image}
              id={order.id}
              customerEmail={order.customer_email}
              shippingCode={order.shipping_to_pincode}
              qty={order.qty}
              title={order.listingData.title}
              sku={order.listingData.sku}
              paymentDone={order.payment_done}
              deliveryDone={order.delivery_done}
              payableAmount={order.payable_amount}
            />
            <div>
              <p className="my-2 mt-5">Order id: {order.id}</p>
              <p className="my-2">Title: {order.listingData.title}</p>
              <p className="my-2">Customer email: {order.customer_email}</p>
              <p className="my-2">Quantity: {order.qty}</p>
              <p className="my-2">Amount: {order.payable_amount}</p>
              <p className="my-2">Shipping code: {order.shipping_to_pincode}</p>
              <p className="my-2">Customer email: {order.customer_email}</p>

              <div className="flex items-center justify-between mt-4">
                <div>
                  Delivery status:{' '}
                  {order.delivery_done ? 'Delivered' : 'Pending'}
                </div>
                {!order.delivery_done && (
                  <Button
                    onClick={async () => {
                      const { data } = await updateDeliveryStatus(order.id);
                      if (data) {
                        order.delivery_done = true;
                        alert('Order delivery status updated');
                        router.reload();
                      }
                    }}
                  >
                    Mark as delivered
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  Payment status:{' '}
                  {order.payment_done ? 'Successful' : 'Pending'}
                </div>
                {!order.payment_done && (
                  <Button
                    onClick={async () => {
                      const { data } = await updatePaymentStatus(order.id);
                      if (data) {
                        order.payment_done = true;
                        alert('Order payment status updated');
                        router.reload();
                      }
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
                <Button
                  onClick={async () => {
                    const result = await easyinvoice.createInvoice(
                      invoiceDetail
                    );
                    easyinvoice.download('myInvoice.pdf', result.pdf);
                  }}
                >
                  Generate invoice
                </Button>
              </div>
            </div>
          </div>
        ))}
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
