/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Button, Card as SupasbaseCard, Typography } from '@supabase/ui';
import { IListing } from '../types';
import { deleteListing } from '../pages/api/listings';

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

  return (
    <div>
      <SupasbaseCard
        cover={[
          listing.images && listing.images?.length >= 1 ? (
            <img
              style={{ height: '300px', objectFit: 'contain' }}
              src={listing.images[0]}
              key={listing.images[0]}
              alt="Cover"
            />
          ) : null,
        ]}
      >
        <div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col h-3 gap-2 justify-around items-start">
              <h2 className="font-bold">{listing.title}</h2>
              <h2>{listing.sku}</h2>
            </div>
            <div className="flex flex-col h-3 gap-2 justify-around items-start">
              <h2>Rs {listing.price}</h2>
              <h2>{listing.sales} Sales</h2>
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
