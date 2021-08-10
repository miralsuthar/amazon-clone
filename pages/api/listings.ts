import { createClient } from '@supabase/supabase-js';
import { IListing } from '../../types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getListings = async (): Promise<{
  success: boolean;
  error: any;
  listings: Array<IListing>;
}> => {
  const { data, error } = await supabase.from('listings').select('*');

  if (error) {
    return {
      success: false,
      error,
      listings: [],
    };
  }
  return {
    success: true,
    error: null,
    // @ts-ignore
    listings: data,
  };
};

export async function getListingImages(listing: any) {
  const fileURLS = [];

  for await (let fileName of listing.image_file_names) {
    const { publicURL } = supabase.storage
      .from('listing-images')
      .getPublicUrl(`${listing.id}/${fileName}`);

    if (publicURL) {
      fileURLS.push(publicURL);
    }
  }

  return fileURLS;
}

export async function createListing(listing: any) {
  const { data, error } = await supabase.from('listings').insert([listing]);

  if (error) {
    console.log('Error while creating listing: ', error);
  }
  if (data) {
    console.log('Listing created: ', data);
  }
  return {
    error,
    data,
  };
}

export async function deleteListing(listingId: string) {
  const { data, error } = await supabase
    .from('listings')
    .delete()
    .match({ id: listingId });
  return {
    data,
    error,
  };
}

export async function uploadImage(file: any, listingId: string, idx: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${idx}.${fileExt}`;
  const filePath = `${listingId}/${fileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(filePath, file);

  if (uploadError) {
    console.log('Error while uploading image: ', uploadError);
    return false;
  }
  console.log('Images uploaded successfully: ', data);
  return true;
}
