import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type PersonalData = {
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  email?: string;
};

export type DocumentData = {
  nationality?: string;
  documentType: string;
  documentNumber: string;
  supportNumber?: string;
  issueDate?: string;
  expiryDate?: string;
};

export type CheckinState = {
  frontImageUri?: string;
  backImageUri?: string;
  personalData: PersonalData;
  documentData: DocumentData;
};

type Action =
  | { type: 'SET_FRONT_IMAGE'; uri: string }
  | { type: 'SET_BACK_IMAGE'; uri: string }
  | { type: 'SET_OCR_DATA'; personalData: Partial<PersonalData>; documentData: Partial<DocumentData> }
  | { type: 'UPDATE_PERSONAL_DATA'; data: Partial<PersonalData> }
  | { type: 'UPDATE_DOCUMENT_DATA'; data: Partial<DocumentData> };

const initialState: CheckinState = {
  personalData: {
    firstName: '',
    lastName: '',
    gender: undefined,
    birthDate: undefined,
    email: undefined,
  },
  documentData: {
    nationality: undefined,
    documentType: '',
    documentNumber: '',
    supportNumber: undefined,
    issueDate: undefined,
    expiryDate: undefined,
  },
};

function reducer(state: CheckinState, action: Action): CheckinState {
  switch (action.type) {
    case 'SET_FRONT_IMAGE':
      return { ...state, frontImageUri: action.uri };
    case 'SET_BACK_IMAGE':
      return { ...state, backImageUri: action.uri };
    case 'SET_OCR_DATA':
      return {
        ...state,
        personalData: { ...state.personalData, ...action.personalData },
        documentData: { ...state.documentData, ...action.documentData },
      };
    case 'UPDATE_PERSONAL_DATA':
      return { ...state, personalData: { ...state.personalData, ...action.data } };
    case 'UPDATE_DOCUMENT_DATA':
      return { ...state, documentData: { ...state.documentData, ...action.data } };
    default:
      return state;
  }
}

type CheckinContextValue = CheckinState & {
  setFrontImage: (uri: string) => void;
  setBackImage: (uri: string) => void;
  setOcrData: (personalData: Partial<PersonalData>, documentData: Partial<DocumentData>) => void;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateDocumentData: (data: Partial<DocumentData>) => void;
};

const CheckinContext = createContext<CheckinContextValue | undefined>(undefined);

export const CheckinProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: CheckinContextValue = {
    ...state,
    setFrontImage: (uri: string) => dispatch({ type: 'SET_FRONT_IMAGE', uri }),
    setBackImage: (uri: string) => dispatch({ type: 'SET_BACK_IMAGE', uri }),
    setOcrData: (personalData, documentData) =>
      dispatch({ type: 'SET_OCR_DATA', personalData, documentData }),
    updatePersonalData: (data) => dispatch({ type: 'UPDATE_PERSONAL_DATA', data }),
    updateDocumentData: (data) => dispatch({ type: 'UPDATE_DOCUMENT_DATA', data }),
  };

  return <CheckinContext.Provider value={value}>{children}</CheckinContext.Provider>;
};

export const useCheckin = () => {
  const ctx = useContext(CheckinContext);
  if (!ctx) {
    throw new Error('useCheckin must be used within CheckinProvider');
  }
  return ctx;
};


