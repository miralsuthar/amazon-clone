import { createClient } from '@supabase/supabase-js';
import { getListings } from './listings';

const supabase = createClient(
  'https://sblavexhrfbpuvtgdenq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODQwMzQwNSwiZXhwIjoxOTQzOTc5NDA1fQ.gMOythX5QQuIk-a6OELIm0dnNGfCZSBBuV1sb_x4NRY'
);

export async function getOrders() {
  let { data: orders, error } = await supabase.from('orders').select('*').eq('platform', 'amazon');

  if (error) {
    return {
      success: false,
      error,
      orders: [],
    };
  }
  return {
    success: true,
    orders,
    error: null,
  };
}

export async function createOrder(order: any, listingSales?: any, listingStocks?: any) {
  const { data, error } = await supabase.from('orders').insert([order]);

  await supabase
    .from('listings')
    .update({ a_sales: listingSales + order.qty, stock: listingStocks - order.qty })
    .eq('id', order.listing_id);
  return { error, data };
}

export async function getListingData(listingID: string) {
  const { listings, error } = await getListings();
  if (error) {
    return {
      data: null,
      error,
    };
  }
  const reqListings = listings.filter((listing) => listing.id === listingID);

  return {
    data: reqListings[0],
    error,
  };
}

export const updatePaymentStatus = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_done: true })
    .eq('id', orderId);
  return { error, data };
};

export const updateDeliveryStatus = async (orderId: any) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ delivery_done: true })
    .eq('id', orderId);
  return { error, data };
};

// @ts-ignore
export const addReview = async (review, oldReviews) => {
  const { data, error } = await supabase.from('reviews').insert([review]);
  
  console.log('review Data: ', data)
  oldReviews.push(data![0].id);

  await supabase
    .from('listings')
    .update({ review_ids: oldReviews })
    .eq('id', review.listing_id);

  return { error, data };
};

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const output = await getOrders();
    if (!output.success) {
      return res.status(500).json(output);
    }
    res.status(200).json(output);
  }

  if (req.method === 'POST') {
    const output = await createOrder(req.body);
    if (output.error) {
      return res.status(500).json(output);
    }
    res.status(200).json(output);
  }
}
