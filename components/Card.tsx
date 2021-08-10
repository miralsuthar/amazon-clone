/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Button, Card as SupasbaseCard, Typography } from '@supabase/ui';
import { IListing } from '../types';
import { deleteListing } from '../pages/api/listings';
import { createOrder } from '../pages/api/orders';
import { useRouter } from 'next/dist/client/router';

export const Card = ({
  listing,
  onDelete,
}: {
  listing: IListing;
  onDelete?: () => null | void;
}) => {
  const [statusLoading, setStatusLoading] = useState<
    'IDLE' | 'LOADING' | 'ERROR'
  >('IDLE');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const onOrderClicked = async () => {
    const order = {
      listing_id: listing.id,
      customer_email: 'miralsuthar@gmail.com',
      shipping_to_pincode: 39002,
      qty: quantity,
      payable_amount: listing.price * quantity,
      payment_done: false,
      delivery_done: false,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await createOrder(order, listing.sales);
    if (!error && data) {
      console.log(data);
      console.log(error);
      alert('Order created Successfully!');
      router.reload();
    }
  };

  return (
    <div>
      <SupasbaseCard
        cover={[
          listing.images && listing.images?.length >= 1 ? (
            <img
              style={{ height: '300px', objectFit: 'contain' }}
              src={listing.images[0]}
              key={listing.images[0]}
              alt='Cover'
            />
          ) : null,
        ]}
      >
        <div>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col h-3 gap-2 justify-around items-start'>
              <h2 className='font-bold'>{listing.title}</h2>
              <h2>{listing.sku}</h2>
            </div>
            <div className='flex flex-col h-3 gap-2 justify-around items-start'>
              <h2>Rs {listing.price}</h2>
              <h2>{listing.sales} Sales</h2>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <div
                  className='cursor-pointer'
                  onClick={() => {
                    if (quantity <= 1) {
                      return;
                    }
                    setQuantity((prevState) => prevState - 1);
                  }}
                >
                  -
                </div>
                <div>{quantity}</div>
                <div
                  className='cursor-pointer'
                  onClick={() => {
                    setQuantity((prevState) => prevState + 1);
                  }}
                >
                  +
                </div>
              </div>
              <button onClick={onOrderClicked}>Buy now</button>
            </div>
          </div>
          {/* <div className=''>
            <Button onClick={onDelete}></Button>
          </div> */}
        </div>
      </SupasbaseCard>
    </div>
  );
};
