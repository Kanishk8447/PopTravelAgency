import { createContext, useContext, useState } from 'react';
import type { Dispatch } from 'react';
import type { SetStateAction } from 'react';

interface ApiContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  notifications: Array<{ message: string; type: string; isTopAlert: boolean }>;
  cardTitle: string;
  updateCardTitle: (newTitle: string) => void;
  showSingleCard: boolean;
  updateCard: (value: boolean) => void;
  step: number;
  updateStep: (newStep: number) => void;
  totalStep: number;
  updateTotalStep: (newTotalStep: number) => void;
  stepData: any;
  updateStepData: (newStepData: any) => void;
  moduleName: string;
  UpdateModuleName: (newModuleName: string) => void;
  startOver: number;
  UpdateStartOver: (over: number) => void;
  subTitle: string;
  updateSubTitle: (title: string) => void;
  selectedAgent: any;
  setSelectedAgent: Dispatch<SetStateAction< any>>;
  selectedInitiative: any;
  setSelectedInitiative: Dispatch<SetStateAction< any>>;
 
}

export const ApiContext = createContext<ApiContextProps | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([]);
  const [cardTitle, setCardTitle] = useState<string>('');
  const [showSingleCard, setShowSingleCard] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [totalStep, setTotalStep] = useState<number>(4);
  const [moduleName, setModuleName] = useState<string>('');
  const [stepData, setStepData] = useState<any>();
  const [startOver, setStartOver] = useState<number>(0);
  const [subTitle, setSubTitle] = useState<string>('');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);


  const updateSubTitle = (title: string) => {
    setSubTitle(title);
  };

  const updateCardTitle = (newTitle: string) => {
    setCardTitle(newTitle);
  };

  const updateCard = (value: boolean) => {
    setShowSingleCard(value);
  };

  const updateStep = (newStep: number) => {
    setStep(newStep);
  };

  const updateTotalStep = (newTotalStep: number) => {
    setTotalStep(newTotalStep);
  };

  const updateStepData = (newStepData: any) => {
    setStepData(newStepData);
  };

  const UpdateModuleName = (newModuleName: string) => {
    setModuleName(newModuleName);
  };

  const UpdateStartOver = (over: number) => {
    setStartOver(over);
  };

  const contextValue: ApiContextProps = {
    loading,
    setLoading,
    notifications,
    cardTitle,
    updateCardTitle,
    showSingleCard,
    updateCard,
    step,
    updateStep,
    totalStep,
    updateTotalStep,
    stepData,
    updateStepData,
    moduleName,
    UpdateModuleName,
    startOver,
    UpdateStartOver,
    subTitle,
    updateSubTitle,
    selectedAgent,
    setSelectedAgent,
    selectedInitiative,
    setSelectedInitiative
  };

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be within an ApiProvider');
  }
  return context;
};
