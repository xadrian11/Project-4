import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { serviceAccount } from '../../firebase.key.json';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'cc-insta-clone-2.appspot.com',
});

const Bucket = getStorage().bucket();

export const uploadImg = async (filePath) => {
  const [file] = await Bucket.upload(filePath, { public: true });
  return file.publicUrl();
};
