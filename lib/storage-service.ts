import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

let storage: ReturnType<typeof getStorage> | null = null;

function getStorageInstance() {
  if (!app) {
    throw new Error('Firebase Storage is not configured');
  }
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadProofFile(file: File, userId: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type "${file.type}" not allowed. Accepted: PDF, JPEG, PNG, WebP, GIF`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB`);
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `proof-documents/${userId}/${timestamp}_${safeName}`;
  const storageRef = ref(getStorageInstance(), path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function uploadResume(file: File, userId: string): Promise<string> {
  const allowed = [...RESUME_TYPES, 'application/pdf'];
  if (!allowed.includes(file.type)) {
    throw new Error('Only PDF or Word documents are accepted for resumes.');
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB`);
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `resumes/${userId}/${timestamp}_${safeName}`;
  const storageRef = ref(getStorageInstance(), path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deleteProofFile(url: string): Promise<void> {
  try {
    const storageRef = ref(getStorageInstance(), url);
    await deleteObject(storageRef);
  } catch (e) {
    console.warn('Failed to delete file:', e);
  }
}
