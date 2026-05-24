import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  limit as firestoreLimit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

function mapDoc(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

async function listCollection(collectionName, orderField = 'created_date', maxItems = 100) {
  const dir = orderField.startsWith('-') ? 'desc' : 'asc';
  const field = orderField.replace(/^-/, '');
  const q = query(
    collection(db, collectionName),
    orderBy(field, dir),
    firestoreLimit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

async function filterCollection(collectionName, filters, orderField = '-created_date', maxItems = 100) {
  const dir = orderField.startsWith('-') ? 'desc' : 'asc';
  const field = orderField.replace(/^-/, '');
  const constraints = Object.entries(filters).map(([k, v]) => where(k, '==', v));
  const q = query(
    collection(db, collectionName),
    ...constraints,
    orderBy(field, dir),
    firestoreLimit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

async function createDocument(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    created_date: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

async function updateDocument(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
  return { id, ...data };
}

async function deleteDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

async function uploadFile(file) {
  const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { file_url: url };
}

function createEntityProxy(collectionName) {
  return {
    list: (orderField, maxItems) => listCollection(collectionName, orderField, maxItems),
    filter: (filters, orderField, maxItems) => filterCollection(collectionName, filters, orderField, maxItems),
    create: (data) => createDocument(collectionName, data),
    update: (id, data) => updateDocument(collectionName, id, data),
    delete: (id) => deleteDocument(collectionName, id),
  };
}

export const dataService = {
  entities: {
    Project: createEntityProxy('projects'),
    ContactMessage: createEntityProxy('messages'),
    Testimonial: createEntityProxy('testimonials'),
    Service: createEntityProxy('services'),
  },
  integrations: {
    Core: {
      UploadFile: ({ file }) => uploadFile(file),
    },
  },
};
