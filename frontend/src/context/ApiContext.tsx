import { createContext, useContext, useState } from 'react';
import type { Dispatch } from 'react';
import type { SetStateAction } from 'react';

// Define interfaces for Agent and Initiative
export interface Agent {
  agent_id: string;
  agent_name: string;
  agent_description: string;
  is_supervisor: boolean;
  agent_character: string;
  model: string;
}

export interface Initiative {
  id: string;
  name: string;
  type: string;
  is_multiagent: boolean;
  multiagent_pattern: string;
  Agents: Agent[];
  [key: string]: any;
}

export interface ChatEntry {
  sessionId: string;
  input: string;
  output: string[] | null;
  isLoading: boolean;
  fileUrls?: string[];
  statusCode?: number;
  topic: 'initiative' | 'travel' | 'manufacturing';
}

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
  stepData: Record<string, unknown>;
  updateStepData: (newStepData: Record<string, unknown>) => void;
  moduleName: string;
  UpdateModuleName: (newModuleName: string) => void;
  startOver: number;
  UpdateStartOver: (over: number) => void;
  subTitle: string;
  updateSubTitle: (title: string) => void;
  selectedAgent: Agent | null;
  setSelectedAgent: Dispatch<SetStateAction<Agent | null>>;
  selectedInitiative: Initiative | null;
  setSelectedInitiative: Dispatch<SetStateAction<Initiative | null>>;
  runInitiative: boolean;
  setRunInitiative: Dispatch<SetStateAction<boolean>>;
  runTravel: boolean;
  setRunTravel: Dispatch<SetStateAction<boolean>>;
  runManufacturing: boolean;
  setRunManufacturing: Dispatch<SetStateAction<boolean>>;
  // Chat history management
  chatHistory: ChatEntry[];
  addChatEntry: (entry: ChatEntry) => void;
  updateChatEntry: (index: number, entry: Partial<ChatEntry>) => void;
  clearChatHistory: (topic?: 'initiative' | 'travel' | 'manufacturing') => void;
  currentSession: string | null;
  setCurrentSession: Dispatch<SetStateAction<string | null>>;
  activeTopic: 'initiative' | 'travel' | 'manufacturing';
  setActiveTopic: Dispatch<SetStateAction<'initiative' | 'travel' | 'manufacturing'>>;
}

export const ApiContext = createContext<ApiContextProps | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<{ message: string; type: string; isTopAlert: boolean }>>([]);
  const [cardTitle, setCardTitle] = useState<string>('');
  const [showSingleCard, setShowSingleCard] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [totalStep, setTotalStep] = useState<number>(4);
  const [moduleName, setModuleName] = useState<string>('');
  const [stepData, setStepData] = useState<Record<string, unknown>>({});
  const [startOver, setStartOver] = useState<number>(0);
  const [subTitle, setSubTitle] = useState<string>('');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [runInitiative, setRunInitiative] = useState<boolean>(false);
  const [runTravel, setRunTravel] = useState<boolean>(false);
  const [runManufacturing, setRunManufacturing] = useState<boolean>(false);
  
  // Chat history management
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<'initiative' | 'travel' | 'manufacturing'>('initiative');

  const addChatEntry = (entry: ChatEntry) => {
    setChatHistory(prev => [...prev, entry]);
  };

  const updateChatEntry = (index: number, partialEntry: Partial<ChatEntry>) => {
    setChatHistory(prev => 
      prev.map((entry, idx) => 
        idx === index ? { ...entry, ...partialEntry } : entry
      )
    );
  };

  const clearChatHistory = (topic?: 'initiative' | 'travel' | 'manufacturing') => {
    if (topic) {
      setChatHistory(prev => prev.filter(entry => entry.topic !== topic));
    } else {
      setChatHistory([]);
    }
  };

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

  const updateStepData = (newStepData: Record<string, unknown>) => {
    setStepData(newStepData);
  };

  const UpdateModuleName = (newModuleName: string) => {
    setModuleName(newModuleName);
  };

  const UpdateStartOver = (over: number) => {
    setStartOver(over);
  };

  console.log('Selected runTravel:', runTravel);


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
    setSelectedInitiative,
    runInitiative,
    setRunInitiative,
    runTravel,
    setRunTravel,
    runManufacturing,
    setRunManufacturing,
    // Chat history management
    chatHistory,
    addChatEntry,
    updateChatEntry,
    clearChatHistory,
    currentSession,
    setCurrentSession,
    activeTopic,
    setActiveTopic
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
