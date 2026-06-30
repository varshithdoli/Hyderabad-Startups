<<<<<<< HEAD
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

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
  const storageRef = ref(storage, path);

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
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deleteProofFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (e) {
    console.warn('Failed to delete file:', e);
  }
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:d0b8d834a27b478bcbf7f5f8585ca7c487d8b642c84015ef2cb9c4b061471b56
size 2021
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
