import { DocumentData, PersonalData } from '../context/CheckinContext';
import { MindeeIdCardResponse } from './mindeeClient';

type MappedData = {
  personalData: Partial<PersonalData>;
  documentData: Partial<DocumentData>;
};

// Helper to safely read a value path from Mindee fields.
function readField(response: MindeeIdCardResponse, fieldName: string): string | undefined {
  try {
    const prediction = response?.document?.inference?.prediction;
    const field = prediction?.[fieldName];
    if (Array.isArray(field) && field.length > 0) {
      return field[0]?.value ?? undefined;
    }
    if (field && typeof field === 'object') {
      return field.value ?? undefined;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function mapMindeeToCheckinData(
  front: MindeeIdCardResponse,
  back: MindeeIdCardResponse
): MappedData {
  // Priorizar frente, usar dorso como respaldo.
  const givenName =
    readField(front, 'given_names') ?? readField(back, 'given_names');
  const surname = readField(front, 'surnames') ?? readField(back, 'surnames');
  const birthDate =
    readField(front, 'birth_date') ?? readField(back, 'birth_date');
  const gender = readField(front, 'sex') ?? readField(back, 'sex');
  const idNumber =
    readField(front, 'id_number') ?? readField(back, 'id_number');
  const country = readField(front, 'country') ?? readField(back, 'country');
  const issueDate =
    readField(front, 'issuance_date') ?? readField(back, 'issuance_date');
  const expiryDate =
    readField(front, 'expiry_date') ?? readField(back, 'expiry_date');

  const personalData: Partial<PersonalData> = {
    firstName: givenName ?? '',
    lastName: surname ?? '',
    gender: gender ?? undefined,
    birthDate: birthDate ?? undefined,
  };

  const documentData: Partial<DocumentData> = {
    nationality: country ?? undefined,
    documentType: '', // editable por el usuario
    documentNumber: idNumber ?? '',
    issueDate: issueDate ?? undefined,
    expiryDate: expiryDate ?? undefined,
  };

  return { personalData, documentData };
}


