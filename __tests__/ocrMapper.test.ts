import { mapMindeeToCheckinData } from '../src/services/ocrMapper';

const buildMindeeResponse = (fields: Record<string, any>) => ({
  document: {
    inference: {
      prediction: fields,
    },
  },
});

describe('mapMindeeToCheckinData', () => {
  it('maps basic fields from Mindee response to personal and document data', () => {
    const front = buildMindeeResponse({
      given_names: [{ value: 'Juan' }],
      surnames: [{ value: 'Pérez' }],
      birth_date: { value: '1990-01-01' },
      id_number: { value: '12345678X' },
      country: { value: 'ES' },
    });
    const back = buildMindeeResponse({});

    const { personalData, documentData } = mapMindeeToCheckinData(front, back);

    expect(personalData.firstName).toBe('Juan');
    expect(personalData.lastName).toBe('Pérez');
    expect(personalData.birthDate).toBe('1990-01-01');
    expect(documentData.documentNumber).toBe('12345678X');
    expect(documentData.nationality).toBe('ES');
  });

  it('falls back to back side when front fields are missing', () => {
    const front = buildMindeeResponse({});
    const back = buildMindeeResponse({
      given_names: [{ value: 'Maria' }],
      surnames: [{ value: 'López' }],
    });

    const { personalData } = mapMindeeToCheckinData(front, back);

    expect(personalData.firstName).toBe('Maria');
    expect(personalData.lastName).toBe('López');
  });
});


