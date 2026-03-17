import {
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

const PLAYER_DATA_COLLECTION = 'users';
const PLAYER_DATA_DOC = 'playerData';

// Kullanıcı verilerini Firestore'dan yükle
export async function loadPlayerData(userId: string): Promise<any | null> {
    try {
        const docRef = doc(db, PLAYER_DATA_COLLECTION, userId, PLAYER_DATA_DOC, 'current');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('✅ Firestore\'dan veri yüklendi');
            return docSnap.data();
        }

        console.log('ℹ️ Firestore\'da veri bulunamadı');
        return null;
    } catch (error) {
        console.error('❌ Firestore okuma hatası:', error);
        throw error;
    }
}

// Kullanıcı verilerini Firestore'a kaydet
export async function savePlayerData(userId: string, data: any): Promise<void> {
    try {
        const docRef = doc(db, PLAYER_DATA_COLLECTION, userId, PLAYER_DATA_DOC, 'current');

        // Timestamp ekle
        const dataWithTimestamp = {
            ...data,
            lastModified: serverTimestamp(),
            syncedAt: new Date().toISOString()
        };

        await setDoc(docRef, dataWithTimestamp, { merge: true });
        console.log('✅ Firestore\'a kaydedildi');
    } catch (error) {
        console.error('❌ Firestore yazma hatası:', error);
        throw error;
    }
}

// Real-time listener - diğer cihazlardan gelen değişiklikleri dinle
export function subscribeToPlayerData(
    userId: string,
    onDataChange: (data: any) => void
): Unsubscribe {
    const docRef = doc(db, PLAYER_DATA_COLLECTION, userId, PLAYER_DATA_DOC, 'current');

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('🔄 Real-time güncelleme alındı');
            onDataChange(data);
        }
    }, (error) => {
        console.error('❌ Real-time listener hatası:', error);
    });
}

// Kullanıcı profilini kaydet/güncelle
export async function saveUserProfile(userId: string, profile: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}): Promise<void> {
    try {
        const docRef = doc(db, PLAYER_DATA_COLLECTION, userId);
        await setDoc(docRef, {
            ...profile,
            lastLoginAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('❌ Profil kaydetme hatası:', error);
    }
}

// AsyncStorage verilerini Firestore'a migrate et
export async function migrateLocalStorageToFirestore(userId: string, localData: any): Promise<void> {
    try {
        // Önce Firestore'da veri var mı kontrol et
        const existingData = await loadPlayerData(userId);

        if (existingData) {
            // Firestore'da zaten veri var, migration yapma
            console.log('ℹ️ Firestore\'da veri mevcut, migration atlandı');
            return;
        }

        // Firestore'da veri yok, localStorage verilerini yükle
        await savePlayerData(userId, {
            ...localData,
            migratedFromLocalStorage: true,
            migratedAt: new Date().toISOString()
        });

        console.log('✅ AsyncStorage verileri Firestore\'a migrate edildi');
    } catch (error) {
        console.error('❌ Migration hatası:', error);
        throw error;
    }
}
