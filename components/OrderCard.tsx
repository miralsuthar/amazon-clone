import React from 'react';
import { Card, Button, Typography } from '@supabase/ui';
import { useRouter } from 'next/dist/client/router';

type Props = {
  id: string;
  customerEmail: string;
  shippingCode: number;
  qty: number;
  payableAmount: number;
  paymentDone?: boolean;
  deliveryDone?: boolean;
  image?: any;
  sku: string;
  title: string;
};
export const OrderCard = ({
  id,
  customerEmail,
  shippingCode,
  qty,
  payableAmount,
  paymentDone,
  deliveryDone,
  sku,
  image,
  title,
}: Props) => {
  const router = useRouter();
  const { pathname } = router;
  const ordersRoute = pathname === '/orders' ? true : false;

  return (
    <div>
      <Card
        className="h-full w-9/12"
        cover={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            onClick={() => {
              if (pathname === '/orders') {
                router.push('/orders/' + id);
              }
            }}
            className={`h-96 object-contain ${
              pathname === '/orders' && 'cursor-pointer'
            }`}
            src={image ? image : '/image.png'}
            alt={'product'}
          />
        }
      >
        {ordersRoute && (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-2xl">{title}</p>
              <p>SKU: {sku}</p>
              <p>Email: {customerEmail}</p>
            </div>
            <div>
              <p>
                Payable amount: Rs.{' '}
                <span className="font-bold">{payableAmount}</span>
              </p>
              {!ordersRoute && <p>Payment: {paymentDone}</p>}
              {!ordersRoute && <p>Delivery: {deliveryDone}</p>}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
