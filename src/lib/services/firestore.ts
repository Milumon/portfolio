import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  demo?: string;
}

export interface SocialLink {
  id: string;
  title: string;
  description: string;
  demo: string;
  icon: string;
  image?: string;
}

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const addProject = async (project: Omit<Project, 'id'>) => {
  return await addDoc(collection(db, 'projects'), project);
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  return await updateDoc(doc(db, 'projects', id), project);
};

export const deleteProject = async (id: string) => {
  return await deleteDoc(doc(db, 'projects', id));
};

// Social Links
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const querySnapshot = await getDocs(collection(db, 'socialLinks'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink));
};

export const addSocialLink = async (link: Omit<SocialLink, 'id'>) => {
  return await addDoc(collection(db, 'socialLinks'), link);
};

export const updateSocialLink = async (id: string, link: Partial<SocialLink>) => {
  return await updateDoc(doc(db, 'socialLinks', id), link);
};

export const deleteSocialLink = async (id: string) => {
  return await deleteDoc(doc(db, 'socialLinks', id));
};

// Creator Tools
export const getCreatorTools = async (): Promise<string[]> => {
  const querySnapshot = await getDocs(collection(db, 'creatorTools'));
  return querySnapshot.docs.map(doc => doc.data().name);
};

export const deleteCreatorTool = async (id: string) => {
  return await deleteDoc(doc(db, 'creatorTools', id));
};

// Dev Tools
export const getDevTools = async (): Promise<string[]> => {
  const querySnapshot = await getDocs(collection(db, 'devTools'));
  return querySnapshot.docs.map(doc => doc.data().name);
};

export const addDevTool = async (name: string) => {
  return await addDoc(collection(db, 'devTools'), { name });
};

export const deleteDevTool = async (id: string) => {
  return await deleteDoc(doc(db, 'devTools', id));
};

export const getDevToolId = async (toolName: string): Promise<string | null> => {
  const querySnapshot = await getDocs(collection(db, 'devTools'));
  const toolDoc = querySnapshot.docs.find(doc => doc.data().name === toolName);
  return toolDoc ? toolDoc.id : null;
};

// Get document ID by name for creator tools (simplified approach)
export const getCreatorToolId = async (name: string): Promise<string | null> => {
  const querySnapshot = await getDocs(collection(db, 'creatorTools'));
  const toolDoc = querySnapshot.docs.find(doc => doc.data().name === name);
  return toolDoc ? toolDoc.id : null;
};