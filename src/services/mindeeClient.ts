import axios from 'axios';

const MINDEE_API_KEY = process.env.EXPO_PUBLIC_MINDEE_API_KEY ?? '';
const MINDEE_IDCARD_ENDPOINT =
  'https://api.mindee.net/v1/products/mindee/idcard/v1/predict';

export type MindeeIdCardResponse = any; // Simplified for this test; see Mindee docs for full typing.

async function buildFormDataFromUri(uri: string, name: string) {
  const formData = new FormData();
  // In Expo React Native, this object shape is supported by fetch/axios when using multipart/form-data.
  formData.append('document', {
    uri,
    name,
    type: 'image/jpeg',
  } as any);
  return formData;
}

export async function analyzeIdCard(
  frontUri: string,
  backUri: string
): Promise<{ front: MindeeIdCardResponse; back: MindeeIdCardResponse }> {
  if (!MINDEE_API_KEY) {
    throw new Error(
      'Mindee API key no configurada. Define EXPO_PUBLIC_MINDEE_API_KEY en tu entorno.'
    );
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Token ${MINDEE_API_KEY}`,
  };

  const frontFormData = await buildFormDataFromUri(frontUri, 'front.jpg');
  const backFormData = await buildFormDataFromUri(backUri, 'back.jpg');

  const [frontRes, backRes] = await Promise.all([
    axios.post(MINDEE_IDCARD_ENDPOINT, frontFormData, { headers }),
    axios.post(MINDEE_IDCARD_ENDPOINT, backFormData, { headers }),
  ]);

  return {
    front: frontRes.data,
    back: backRes.data,
  };
}


