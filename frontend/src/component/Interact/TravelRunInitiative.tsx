import { useEffect, useRef, FormEvent, useState, Suspense, FC, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import apiService from '../../service/apiService';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './runInitiative.css';
import { notification } from '../../service/notification-Service';
import type { Components } from 'react-markdown';
// import { useInitiativeStore } from '../../store/InitiativeStore';
// import { String } from 'aws-sdk/clients/acm';
import { RunInitiativeSource } from './RunInitiativeSourceEnum';
import { useApi } from '../../context/ApiContext';
import type { ChatEntry } from '../../context/ApiContext';
import Select from 'react-select';
import '../TravelAgency/travel.css';
import { useLocation } from 'react-router-dom';

// Define the HastNode type
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, any>;
  children?: HastNode[];
  value?: string;
};

interface GetListResponse {
  status: string;
  data: Initiative[];
}

export interface Agent {
  agent_id: string;
  agent_name: string;
  agent_character: string;
  is_supervisor: boolean;
  agent_description: string | null;
  tools: any[];
  model: string;
  memory: boolean;
  guardrail: boolean;
}

export interface Initiative {
  id: string;
  name: string;
  type: string;
  is_multiagent: boolean;
  multiagent_pattern: any | null;
  cloud: string;
  Agents: Agent[];
  files: any[];
  [key: string]: any;
  tags: {
    key: string;
    value: string;
  }[];
}

interface ChatEntry {
  sessionId: string;
  input: string;
  output: string[] | null;
  isLoading: boolean;
  statusCode?: number; // Optional: Store HTTP status for future use
  fileUrls?: string[]; // <--- We'll store local doc/other file URLs here
}

interface GuardrailResult {
  message: string;
  details: {
    guardrail_name: string;
    validation_passed: string;
    failure_reason: string | null;
  }[];
}

interface ChatResponse {
  status: string;
  session_id: string;
  output_text: string[];
  message?: string; // For guardrail failure response
  details?: {
    guardrail_name: string;
    validation_passed: string;
    failure_reason: string | null;
  }[];
}

interface ChatRequest {
  input_message: string;
  session_id?: string;
  project_id?: string;
}

// Properly typed component props
interface TableProps {
  node?: HastNode;
  children?: React.ReactNode;
  [key: string]: any;
}

interface ParagraphProps {
  node?: HastNode;
  children?: React.ReactNode;
  [key: string]: any;
}

interface ListItemProps {
  node?: HastNode;
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeProps {
  node?: HastNode;
  inline?: boolean;
  className?: string;
  children: string | string[];
  [key: string]: any;
}

interface HeadingProps {
  node?: HastNode;
  children?: React.ReactNode;
  [key: string]: any;
}

interface LinkProps {
  node?: HastNode;
  href?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const mimeTypeFormats = {
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};
const allowedFileTypes = '.txt, .pdf, .doc, .docx, .xls, .xlsx, .csv'; // can also handle .jpeg
const maxFiles = 5;
const maxFileSizeKB = 250; // example: 250 KB limit


export default function TravelRunInitiative({
  source = RunInitiativeSource.Native,
  isExpanded = false,
  interactHeight = false
}: {
  source: String;
  isExpanded: boolean;
  interactHeight: boolean;
}) {

  // const { initiatives } = useInitiativeStore();
  const { selectedAgent,setLoading, setSelectedAgent, selectedInitiative, setSelectedInitiative,
    runInitiative,
    setRunInitiative,
    runTravel,
    setRunTravel,
    runManufacturing,
    setRunManufacturing,
    updateCardTitle,
    setActiveTopic
   } =
    useApi();

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [guardrailModalOpen, setGuardrailModalOpen] = useState(false);
  const [guardrailReasons, setGuardrailReasons] = useState('');
  const [guardrailFailureData, setGuardrailFailureData] = useState<{
    failureReason: string;
    guardrailName: string;
  } | null>(null);

   const CardTitle = 'POP Travel Agency';

   useEffect(() => {
    updateCardTitle(CardTitle);
  }, []);

const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [locations, setLocations] = useState([]);

  const locationJSON = [
    {
      label: 'India',
      officialName: 'Republic of India',
      capital: ['New Delhi'],
      region: 'Asia',
      subregion: 'Southern Asia',
      population: 1393409038,
      area: 3287590,
      timezones: ['UTC+05:30'],
      borders: ['AFG', 'BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
      languages: { eng: 'English', hin: 'Hindi' },
      currency: { INR: { name: 'Indian rupee', symbol: '₹' } },
      flag: 'https://flagcdn.com/in.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/in.svg',
      maps: { googleMaps: 'https://goo.gl/maps/WSk3fLwG4vtPQetp7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2011': 35.7 },
      car: { signs: ['IND'], side: 'left' }
    },
    {
      label: 'Sweden',
      officialName: 'Kingdom of Sweden',
      capital: ['Stockholm'],
      region: 'Europe',
      subregion: 'Northern Europe',
      population: 10353442,
      area: 450295,
      timezones: ['UTC+01:00'],
      borders: ['FIN', 'NOR'],
      languages: { swe: 'Swedish' },
      currency: { SEK: { name: 'Swedish krona', symbol: 'kr' } },
      flag: 'https://flagcdn.com/se.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/se.svg',
      maps: { googleMaps: 'https://goo.gl/maps/iqygE491ADVgnBW39' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2018': 30.0 },
      car: { signs: ['S'], side: 'right' }
    },
    {
      label: 'China',
      officialName: "People's Republic of China",
      capital: ['Beijing'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 1402112000,
      area: 9706961,
      timezones: ['UTC+08:00'],
      borders: [
        'AFG',
        'BTN',
        'MMR',
        'HKG',
        'IND',
        'KAZ',
        'PRK',
        'KGZ',
        'LAO',
        'MAC',
        'MNG',
        'NPL',
        'PAK',
        'RUS',
        'TJK',
        'VNM'
      ],
      languages: { cmn: 'Mandarin' },
      currency: { CNY: { name: 'Chinese yuan', symbol: '¥' } },
      flag: 'https://flagcdn.com/cn.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/cn.svg',
      maps: { googleMaps: 'https://goo.gl/maps/p9qC6rFCJzA8fKzD7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2016': 38.5 },
      car: { signs: ['CHN'], side: 'right' }
    },
    {
      label: 'Japan',
      officialName: 'Japan',
      capital: ['Tokyo'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 125960000,
      area: 377930,
      timezones: ['UTC+09:00'],
      borders: [],
      languages: { jpn: 'Japanese' },
      currency: { JPY: { name: 'Japanese yen', symbol: '¥' } },
      flag: 'https://flagcdn.com/jp.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/jp.svg',
      maps: { googleMaps: 'https://goo.gl/maps/NGTLSCSrA8bMrvnX9' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2013': 32.1 },
      car: { signs: ['J'], side: 'left' }
    },
    {
      label: 'United States',
      officialName: 'United States of America',
      capital: ['Washington, D.C.'],
      region: 'Americas',
      subregion: 'Northern America',
      population: 331002651,
      area: 9833517,
      continent: ['North America'],
      timezones: [
        'UTC−12:00',
        'UTC−11:00',
        'UTC−10:00',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−07:00',
        'UTC−06:00',
        'UTC−05:00',
        'UTC+10:00',
        'UTC+12:00'
      ],
      borders: ['CAN', 'MEX'],
      languages: { eng: 'English' },
      currency: { USD: { name: 'United States dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/us.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/us.svg',
      maps: { googleMaps: 'https://goo.gl/maps/5T6E5sQnZf9A9T2J6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'USA',
      latlng: [38.0, -97.0],
      postalCodeFormat: '#####-####'
    },
    {
      label: 'Germany',
      officialName: 'Federal Republic of Germany',
      capital: ['Berlin'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 83783942,
      area: 357114,
      continent: ['Europe'],
      timezones: ['UTC+01:00'],
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      languages: { deu: 'German' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/de.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/de.svg',
      maps: { googleMaps: 'https://goo.gl/maps/mD9FBMq1nvXUBrkv6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'GER',
      latlng: [51.0, 9.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'France',
      officialName: 'French Republic',
      capital: ['Paris'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 65273511,
      area: 551695,
      continent: ['Europe'],
      timezones: [
        'UTC−10:00',
        'UTC−09:30',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−04:00',
        'UTC−03:00',
        'UTC+01:00',
        'UTC+03:00',
        'UTC+04:00',
        'UTC+05:00',
        'UTC+11:00',
        'UTC+12:00'
      ],
      borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
      languages: { fra: 'French' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/fr.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/fr.svg',
      maps: { googleMaps: 'https://goo.gl/maps/g7QxxSFsWyTPKuzd7' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'FRA',
      latlng: [46.0, 2.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'Brazil',
      officialName: 'Federative Republic of Brazil',
      capital: ['Brasília'],
      region: 'Americas',
      subregion: 'South America',
      population: 212559417,
      area: 8515767,
      continent: ['South America'],
      timezones: ['UTC−05:00', 'UTC−04:00', 'UTC−03:00', 'UTC−02:00'],
      borders: ['ARG', 'BOL', 'COL', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
      languages: { por: 'Portuguese' },
      currency: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Australia',
      officialName: 'Commonwealth of Australia',
      capital: ['Canberra'],
      region: 'Oceania',
      subregion: 'Australia and New Zealand',
      population: 25499884,
      area: 7692024,
      continent: ['Oceania'],
      timezones: [
        'UTC+05:00',
        'UTC+06:30',
        'UTC+07:00',
        'UTC+08:00',
        'UTC+09:30',
        'UTC+10:00',
        'UTC+10:30',
        'UTC+11:30'
      ],
      borders: [],
      languages: { eng: 'English' },
      currency: { AUD: { name: 'Australian dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Russia',
      officialName: 'Russian Federation',
      capital: ['Moscow'],
      region: 'Europe',
      subregion: 'Eastern Europe',
      population: 144104080,
      area: 17098242,
      continent: ['Europe', 'Asia'],
      timezones: ['UTC+03:00 to UTC+12:00'],
      borders: [
        'AZE',
        'BLR',
        'CHN',
        'EST',
        'FIN',
        'GEO',
        'KAZ',
        'PRK',
        'LVA',
        'LTU',
        'MNG',
        'NOR',
        'POL',
        'UKR'
      ],
      languages: { rus: 'Russian' },
      currency: { RUB: { name: 'Russian ruble', symbol: '₽' } },
      flag: 'https://flagcdn.com/ru.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/ru.svg',
      maps: { googleMaps: 'https://goo.gl/maps/6ua6CX1mV2z5eYxZ6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'RUS',
      latlng: [60, 100],
      postalCodeFormat: '######'
    }
  ];

  useEffect(() => {
    setLocations(locationJSON);
  }, []);

  const prepareTravelPrompt = () => {
    if (!fromLocation || !toLocation || !checkIn || !checkOut) {
      notification('error', 'Please select all fields');
      return '';
    }

    return `Travel Destination Details:
FROM LOCATION: ${fromLocation.label}
TO LOCATION: ${toLocation.label}
CHECK-IN DATE: ${checkIn}
CHECK-OUT DATE: ${checkOut}`;
  };
  
  const [showTravelChat, setShowTravelChat] = useState(false);
  const [initiatives, setInitiatives] = useState();
  
  // Filter chat history based on active topic
  const filteredChatHistory = useMemo(() => {
    if (runInitiative) {
      setActiveTopic('initiative');
      return chatHistory.filter(chat => chat.topic === 'initiative');
    } else if (runTravel) {
      setActiveTopic('travel');
      return chatHistory.filter(chat => chat.topic === 'travel');
    } else if (runManufacturing) {
      setActiveTopic('manufacturing');
      return chatHistory.filter(chat => chat.topic === 'manufacturing');
    }
    return [];
  }, [chatHistory, runInitiative, runTravel, runManufacturing, setActiveTopic, showTravelChat]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getData('api/initiative/list');
        if (response) {
          setInitiatives(response);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error:', error);
        notification('error', 'Failed to search. Try again!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const location = useLocation();

  useEffect(() => {
    // Check the current path and set states accordingly
    if (location.pathname === '/run-initiative') {
      setRunTravel(false);
      setRunManufacturing(false);
      setRunInitiative(true);
      
      // Store state in local storage
      localStorage.setItem('RunTravel', 'false');
      localStorage.setItem('RunManufacturing', 'false');
      localStorage.setItem('RunInitiative', 'true');
    } else {
      // Retrieve state from local storage for other paths
      const runTravel = localStorage.getItem('RunTravel') === 'true';
      const runManufacturing = localStorage.getItem('RunManufacturing') === 'true';
      const runInitiative = localStorage.getItem('RunInitiative') === 'true';

      setRunTravel(runTravel);
      setRunManufacturing(runManufacturing);
      setRunInitiative(runInitiative);
    }
  }, [location.pathname, setRunTravel, setRunManufacturing, setRunInitiative]);



  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Insert a newline at the cursor
        event.preventDefault();
        const { selectionStart, selectionEnd } = event.currentTarget;
        const before = chatInput.slice(0, selectionStart);
        const after = chatInput.slice(selectionEnd);
        setChatInput(`${before}\n${after}`);
        // Reposition cursor, if you want to do that with setTimeout, etc.
      } else {
        // Normal ENTER: submit
        if (disableButton) return;
        event.preventDefault();
        handleFormSubmit(event);
      }
    }
  };

  useEffect(() => {
    if (selectedInitiative) {
      setSelectedInitiative(selectedInitiative);
      // Add condition to set the selected agent as the first agent if there are multiple agents
      if (selectedInitiative.Agents && selectedInitiative.Agents.length > 1) {
        setSelectedAgent(null);
      } else {
        setSelectedAgent(selectedInitiative.Agents[0]);
      }
    } else if (initiatives && initiatives.length > 0 && !selectedAgent && !selectedInitiative) {
      const firstInitiativeWithAgents = initiatives.find(
        (initiative) => initiative.Agents && initiative.Agents.length > 0
      );
      if (firstInitiativeWithAgents) {
        // setSelectedInitiative(firstInitiativeWithAgents);
        // setSelectedAgent(firstInitiativeWithAgents.Agents[0]);
        setSelectedInitiative(firstInitiativeWithAgents);
        // Correctly select the first agent ONLY if there's only one.
        if (firstInitiativeWithAgents.Agents.length === 1) {
          setSelectedAgent(firstInitiativeWithAgents.Agents[0]);
        } else {
          setSelectedAgent(null);
        }
      }
    }
  }, [initiatives, selectedAgent, selectedInitiative]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) => {
      notification('error', 'Some files were rejected.');
    },
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    multiple: true,
    noClick: true
  });

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  // NEW or MODIFIED: handle the actual file input
  const handleFileChange = (files: FileList | File[] | null) => {
    if (!files) return;
    let newFiles = Array.isArray(files) ? files : Array.from(files);

    // Filter to known doc-like mime types
    newFiles = newFiles.filter((f) => mimeTypeFormats.hasOwnProperty(f.type));

    // Enforce size limit
    const bigFiles = newFiles.filter((f) => f.size > maxFileSizeKB * 1024);
    if (bigFiles.length > 0) {
      notification('warning', 'Some files exceed 250 KB limit.');
    }
    newFiles = newFiles.filter((f) => f.size <= maxFileSizeKB * 1024);

    // Enforce total count
    if (selectedFiles.length + newFiles.length > maxFiles) {
      const allowedSlots = maxFiles - selectedFiles.length;
      notification('warning', `You can only upload a maximum of ${maxFiles} files in total.`);
      newFiles = newFiles.slice(0, allowedSlots);
    }

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const blobUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      blobUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [blobUrls]);

  useEffect(() => {
    return () => {
      blobUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [blobUrls]);

  function handleRemoveFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    // Check if the selected value is an initiative ID or an agent ID
    const selectedInitiativeOrAgent = initiatives?.data?.find(
      (initiative) =>
        initiative.id === selectedValue ||
        initiative.Agents.some((agent) => agent.agent_id === selectedValue)
    );
    if (!selectedInitiativeOrAgent) {
      return;
    }

    if (selectedInitiativeOrAgent.id === selectedValue) {
      // Initiative is selected
      setSelectedInitiative(selectedInitiativeOrAgent);
      setSelectedAgent(null); // Clear selected agent
      setChatHistory([]);
      setCurrentSession(null);
    } else {
      // Agent is selected
      const newSelectedAgent = selectedInitiativeOrAgent.Agents.find(
        (agent) => agent.agent_id === selectedValue
      );
      if (newSelectedAgent) {
        setSelectedInitiative(selectedInitiativeOrAgent);
        setSelectedAgent(newSelectedAgent);
        setChatHistory([]);
        setCurrentSession(null);
      }
    }
  };

  const CodeComponent: any = ({
    inline,
    className,
    children,
    ...props
  }: {
    inline: any;
    className: string;
    children: any;
  }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'plaintext';
    const [copied, setCopied] = useState<boolean>(false);

    // Ensure children is always a string
    const codeContent: string = Array.isArray(children)
      ? children.join('')
      : typeof children === 'string'
        ? children
        : '';

    return !inline && match ? (
      <div className="code-block-wrapper" style={{ position: 'relative' }}>
        <span
          onClick={() => {
            setCopied(true);
            handleCopy(codeContent);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`material-symbols-outlined font-weight-normal copy-icon-cs ${
            copied ? 'checkmark' : ''
          }`}>
          {copied ? 'check' : 'content_copy'}
        </span>
        <div>
          <SyntaxHighlighter language={language} style={gruvboxDark}>
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <code className="code-scrollbar" {...props}>
        {codeContent}
      </code>
    );
  };

  // Define components with proper typing
  const components: Components = {
    table: ({ node, ...props }: TableProps) => (
      <table className="table table-responsive table-bordered table-striped" {...props} />
    ),
    p: ({ node, ...props }: ParagraphProps) => (
      <p className="chat-input-font" style={{ marginBottom: '10px' }} {...props} />
    ),
    li: ({ node, ...props }: ListItemProps) => <li style={{ marginBottom: '5px' }} {...props} />,
    code: CodeComponent,
    h1: ({ node, ...props }: HeadingProps) => (
      <h1
        style={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #333' }}
        {...props}
      />
    ),
    h2: ({ node, ...props }: HeadingProps) => (
      <h2
        style={{ fontWeight: 'bold', padding: '8px', borderBottom: '1px solid #333' }}
        {...props}
      />
    ),
    h3: ({ node, ...props }: HeadingProps) => (
      <h3 style={{ fontWeight: 'bold', padding: '6px', color: '#333131' }} {...props} />
    ),
    a: ({ node, href, ...props }: LinkProps) => (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    )
  };

  const handleCopy = (text: string) => {
    if (typeof text === 'string') {
      navigator.clipboard.writeText(text);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (disableButton) return;

    // if (!selectedInitiative) {
    //   notification('error', 'Please select an agent');
    //   return;
    // }

    const trimmedText = chatInput.trim();
    const hasFiles = selectedFiles.length > 0;

    if (trimmedText === '') {
      notification('warning', 'Please include text');
      return;
    }

    if (!trimmedText && !hasFiles) {
      notification('error', 'Please include text or select a file!');
      return;
    }

    if (!chatInput) {
      if (selectedFiles.length > 0) {
        notification('warning', 'Please include text along with file');
        return;
      }
      return;
    }

    // Determine the current topic based on active section
    let currentTopic: 'initiative' | 'travel' | 'manufacturing' = 'initiative';
    if (runTravel) {
      currentTopic = 'travel';
    } else if (runManufacturing) {
      currentTopic = 'manufacturing';
    }

    // Create a new chat entry with appropriate topic
    const newEntry: ChatEntry = {
      sessionId: currentSession || '',
      input: trimmedText,
      output: null,
      isLoading: true,
      fileUrls: selectedFiles.map((file) => URL.createObjectURL(file)),
      topic: currentTopic
    };

    setChatHistory((prev) => [...prev, newEntry]);
        // addChatEntry(newEntry);


    setSelectedFiles([]);

    if (textareaRef.current) {
      textareaRef.current.value = '';
    }

    setDisableButton(true);

    try {
       const endpoint = `initiative/27eba2d3-f039-477c-9eee-64847c7709df`;
    //   const endpoint = `initiative/${selectedInitiative?.id}`;
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  const commonHeaders = {
    'accept': 'application/json , text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'origin': 'https://localhost:5173',
    'pragma': 'no-cache',
    "content-type": "application/json",
    'referer': 'https://gen-ai-foundation-demo-cec4ghc4aeesbjba.a03.azurefd.net',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'x-api-key': '159c603a-2d22-4a5d-8b01-8158a5f6973c'
  };


      let session_id: string;
      let output_text: string[];

      if (hasFiles) {
        const formData = new FormData();
        formData.append('input_message', trimmedText);
        if (currentSession) formData.append('session_id', currentSession);
        selectedFiles.forEach((file) => formData.append('files', file));

        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        session_id = data.session_id;
        output_text = data.output_text;
      } else {
        const payload: ChatRequest = {
          input_message: trimmedText,
          ...(currentSession && { session_id: currentSession })
        };
        // const response = await apiService.postData<ChatRequest, ChatResponse>(endpoint, payload);

        // Check if the response has data property (wrapped in ApiResponse)
        // const responseData = response.data || response;


            const response = await fetch(`${apiBaseUrl}/api/${endpoint}`, {
 method: 'POST',
      // mode: 'no-cors',
      headers: {
        ...commonHeaders,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
 const responseData = await response.json();
    console.log('sdds',responseData.output_text)
        
          // Remove the loading state from chat history
          setChatHistory((prev) =>
            prev.map((entry, idx) =>
              idx === prev.length - 1 ? { ...entry, isLoading: false, output: null } : entry
            )
          );


        session_id = responseData?.session_id;
        output_text = responseData?.output_text;
      }

      setChatHistory((prev) =>
        prev.map((entry, idx) =>
          idx === prev.length - 1
            ? { ...entry, sessionId: session_id, output: output_text, isLoading: false }
            : entry
        )
      );
      setCurrentSession(session_id);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setChatHistory((prev) =>
        prev.map((entry, idx) =>
          idx === prev.length - 1
            ? { ...entry, output: ['Error occurred'], isLoading: false, statusCode: 500 }
            : entry
        )
      );
    } finally {
      setChatInput('');
      setSelectedFiles([]);
      setDisableButton(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [filteredChatHistory]);

  return (
    <div className={`travel-run-container ${interactHeight ? 'h-100' : 'h-100'}`}>
      <div className="container-margin-left" style={{ display: 'flex', height: '100%' }}>
        <div className="row w-100">
          <div className=" overflow-scroll-y d-flex h-100">
            <div className="col-12 d-flex flex-column justify-content-between">
              <div className="d-flex negative-marginLeft16px">
                <div className="ml-n3 px-2 py-1 d-flex align-items-center justify-content-center"></div>
                <div className="d-flex"></div>
              </div>
              <Suspense fallback={<div>Fetching Initiatives</div>}>
                {/* {initiatives?.data && initiatives?.data.length > 0 ? (
                  <div className="agent-dropdown-container">
                    <select
                      value={selectedAgent?.agent_id || selectedInitiative?.id || ''}
                      onChange={handleAgentChange}
                      className="agent-dropdown border-none"
                      disabled={!initiatives || initiatives.length === 0}>
                      {initiatives?.data.map((initiative) => {
                        if (initiative.Agents.length > 1) {
                          return (
                            <option key={initiative.id} value={initiative.id}>
                              {' '}
                              {initiative.name}
                            </option>
                          );
                        } else {
                          return initiative.Agents.map((agent) => (
                            <option key={agent.agent_id} value={agent.agent_id}>
                              {initiative.name ? initiative.name : agent.agent_name}
                            </option>
                          ));
                        }
                      })}
                    </select>
                  </div>
                ) : (
                  <div>No agents available</div>
                )} */}
              </Suspense>
              <div
                className="flex-grow-1 overflow-auto custom-scrollbar2 mt-2"
                ref={chatContainerRef}>
                {filteredChatHistory.length > 0 ? (
                  filteredChatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${source === RunInitiativeSource.Interact ? '' : 'mx-129'}`}>
                      <div className="d-flex justify-content-end mb-1 mx-2">
                        <div className="chat-input-animation flex-column mb-1 p-3 mr-2 flexible-box">
                          <div className="chat-input chat-input-font chat-input-animation mb-2">
                            {chat.input}
                          </div>
                          <div className="d-flex justify-content-end chat-input-animation">
                            <div
                              className="bg-light rounded-full d-flex justify-content-center align-items-center"
                              style={{
                                height: '28px',
                                width: '28px',
                                borderRadius: '50%'
                              }}>
                              <span
                                onClick={() => {
                                  handleCopy(chat.input);
                                  notification('success', 'Copied successfully!');
                                }}
                                className="material-symbols-outlined font-weight-normal mr-n1 input-text-copy-bg">
                                {' '}
                                content_copy{' '}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-start mb-1 mx-2"
                        style={{
                          maxWidth: `${Math.min(100, chat.output?.[0] ? 75 : 50)}%`
                        }}>
                        <div className="mr-2" style={{ color: '#015A82' }}>
                          <img
                            className="small-blue-text"
                            alt=""
                            style={{
                              color: '#025A82',
                              fontSize: '24px'
                            }}
                            src="/auto_awesome_onestar.svg"
                          />
                        </div>
                        <div className="chat-input-animation flexible-box p-2 d-flex flex-column chat-input-font chat-input-animation mt-2">
                          {chat.isLoading ? (
                            <LoadingAnimation />
                          ) : (
                            <>
                              {chat.output?.map((chatItem, index) => (
                                <Markdown
                                  key={index}
                                  components={components}
                                  remarkPlugins={[
                                    [
                                      remarkGfm,
                                      {
                                        gfm: true,
                                        breaks: true,
                                        html: true,
                                        tables: true
                                      }
                                    ]
                                  ]}>
                                  {chatItem}
                                </Markdown>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* <LandingPage source={source} isExpanded={isExpanded} /> */}
                    <div className='travelAgent-chat-input-container'>
                 <div className='d-flex align-items-center justify-content-center'>
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className='text-bold'>TRAVEL TO EXPLORE</h1>
          <p className='text-bold'>Find destinations at city, state, or country levels.</p>
        </div>
        <div className="row searchBox mt-5">
          <div className="col-md-3">
            <label>From</label>
            <Select
              options={locations}
              value={fromLocation}
              onChange={setFromLocation}
              placeholder="Search for Country..."
              styles={{
                container: (provided) => ({
                  ...provided,
                }),
                control: (provided) => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none'
                })
              }}
            />
          </div>
          <div className="col-md-3">
            <label>To</label>
            <Select
              options={locations}
              value={toLocation}
              onChange={setToLocation}
              placeholder="Search for destination..."
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '250px'
                }),
                control: (provided) => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none'
                })
              }}
            />
            
          </div>
          <div className="col-md-3">
            <label>Check-in</label>
            <input
              type="date"
              className="bg-white  rounded-2"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="col-md-3">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              className="bg-white rounded-2"
              onChange={(e) => setCheckOut(e.target.value)}
              min={
                checkIn
                  ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
            />
          </div>
        </div>

        <div className='d-flex justify-content-center mt-5'>
            <form
                    onSubmit={handleFormSubmit}>
                    {filteredChatHistory.length === 0 && (
                    <div>
                        <button
                                type="submit"
                                // onClick={handleSubmitPrompt}
                                disabled={!fromLocation || !toLocation || !checkIn || !checkOut}
                                className="btn btn-primary p-3 text-center rounded-3"
                                style={{
                                opacity: (!fromLocation || !toLocation || !checkIn || !checkOut) ? 0.5 : 1,
                                cursor: (!fromLocation || !toLocation || !checkIn || !checkOut) ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => {
                                const prompt = prepareTravelPrompt();
                                if (prompt) {
                                
                                    setChatInput(prompt);
                                }
                                }}
                            >
                            Explore Now
                            </button>
                        </div>
                        )}
            </form>
        </div>
      </div>
    </div>
                    </div>
                  </>
            )}
              </div>
              {filteredChatHistory.length > 0 && (
              <div
                className={`p-1 ${source === RunInitiativeSource.Interact && !isExpanded ? '' : 'mx-129'} mb-3 `}
                {...getRootProps()}
                style={{ display: 'flex' }}>
                <form
                  className={`chat-window no-border w-100 ${interactHeight && !isExpanded ? ' mb-3' : ''}`}
                  onSubmit={handleFormSubmit}>
                  {/* Preview Container */}
                  {selectedFiles.length > 0 && (
                    <div
                      className="file-preview-container mb-2"
                      style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selectedFiles.map((file, index) => {
                        const fileUrl = blobUrls[index]; // The generated object URL for the file
                        return (
                          <div
                            key={index}
                            className="file-preview"
                            style={{
                              position: 'relative',
                              display: 'inline-block',
                              width: '180px',
                              marginBottom: '8px'
                            }}>
                            <div
                              style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '8px',
                                width: '180px',
                                textAlign: 'center'
                              }}>
                              <i className="fas fa-file" style={{ marginRight: '6px' }} />
                              {file.name}
                            </div>
                            {/* "X" Close Button */}
                            <span
                              onClick={() => handleRemoveFile(index)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                color: '#fff',
                                backgroundColor: '#333',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '14px',
                                lineHeight: '20px'
                              }}>
                              &times;
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* The input group for text message & file input */}
                  <div className="input-group">
                    <textarea
                      className="form-control shadow-none no-border chat_input font-italic auto-resize text-area-custom-style max-h-[25dvh]"
                      name="chat_text"
                      placeholder="Message agent"
                      aria-label="Chat input"
                      // value={chatInput} // <-- Controlled value
                      onChange={(e) => setChatInput(e.target.value)} // <-- Update our local state
                      ref={textareaRef}
                      onKeyDown={handleKeyDown}
                    />
                    <span
                      className="input-group-text right-rounded-bg d-flex no-border"
                      style={{ gap: '0.5rem' }}>
                      
                      {/* Send button */}
                      <button
                        type="submit"
                        className="btn btn-white p-2 rounded-circle small-blue-box">
                        <img
                          className="arrow-up-icon"
                          alt="Send"
                          src="/arrow_upward_alt_24dp.svg"
                        />
                      </button>
                    </span>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LandingPage = ({
  source = RunInitiativeSource.Native,
  isExpanded
}: {
  source: string;
  isExpanded: boolean;
}) => {
  return (
    <div className="d-flex flex-column align-items-center text-center justify-content-center h-100">
      <div className="d-flex justify-content-center mt-2">
        <img
          className="mr-2 mt-n3 large-blue-text"
          alt=""
          style={{ color: '#025A82' }}
          src="/auto_awesome_24dp.svg"
        />
      </div>
      <h2
        className={`${source === RunInitiativeSource.Interact && !isExpanded ? '' : 'medium-weight-margined'}`}>
        {' '}
        Welcome to Run Initiative!{' '}
      </h2>
      <p
        className={`semi-thick text-center justify-content-center align-items-center mx-auto mt-2 ${source === RunInitiativeSource.Interact && !isExpanded ? '' : ' wide-margined'}`}>
        Unleash your creativity and customize your AI interactions right here. Refine and run your
        initiatives, enabling interaction in a chat-like environment. Test and execute your
        initiatives to receive responses. Dive in and start creating—your next innovation begins
        now!
      </p>
    </div>
  );
};

const TravelLandingPage = ({
  setShowTravelChat,selectedInitiative,disableButton,setDisableButton ,
  currentSession,setCurrentSession,setChatHistory,chatHistory
}: {
  setShowTravelChat?: (show: boolean) => void;
  selectedInitiative?: any;
  disableButton?: boolean;
  setDisableButton ?: (disable: boolean) => void;
  currentSession?: string | null;
  setCurrentSession?: (sessionId: string | null) => void;
  setChatHistory?: (history: ChatEntry[]) => void;
  chatHistory?: ChatEntry[];
}) => {
  // const { addChatEntry, setCurrentSession } = useApi();
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [locations, setLocations] = useState([]);

  const locationJSON = [
    {
      label: 'India',
      officialName: 'Republic of India',
      capital: ['New Delhi'],
      region: 'Asia',
      subregion: 'Southern Asia',
      population: 1393409038,
      area: 3287590,
      timezones: ['UTC+05:30'],
      borders: ['AFG', 'BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
      languages: { eng: 'English', hin: 'Hindi' },
      currency: { INR: { name: 'Indian rupee', symbol: '₹' } },
      flag: 'https://flagcdn.com/in.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/in.svg',
      maps: { googleMaps: 'https://goo.gl/maps/WSk3fLwG4vtPQetp7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2011': 35.7 },
      car: { signs: ['IND'], side: 'left' }
    },
    {
      label: 'Sweden',
      officialName: 'Kingdom of Sweden',
      capital: ['Stockholm'],
      region: 'Europe',
      subregion: 'Northern Europe',
      population: 10353442,
      area: 450295,
      timezones: ['UTC+01:00'],
      borders: ['FIN', 'NOR'],
      languages: { swe: 'Swedish' },
      currency: { SEK: { name: 'Swedish krona', symbol: 'kr' } },
      flag: 'https://flagcdn.com/se.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/se.svg',
      maps: { googleMaps: 'https://goo.gl/maps/iqygE491ADVgnBW39' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2018': 30.0 },
      car: { signs: ['S'], side: 'right' }
    },
    {
      label: 'China',
      officialName: "People's Republic of China",
      capital: ['Beijing'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 1402112000,
      area: 9706961,
      timezones: ['UTC+08:00'],
      borders: [
        'AFG',
        'BTN',
        'MMR',
        'HKG',
        'IND',
        'KAZ',
        'PRK',
        'KGZ',
        'LAO',
        'MAC',
        'MNG',
        'NPL',
        'PAK',
        'RUS',
        'TJK',
        'VNM'
      ],
      languages: { cmn: 'Mandarin' },
      currency: { CNY: { name: 'Chinese yuan', symbol: '¥' } },
      flag: 'https://flagcdn.com/cn.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/cn.svg',
      maps: { googleMaps: 'https://goo.gl/maps/p9qC6rFCJzA8fKzD7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2016': 38.5 },
      car: { signs: ['CHN'], side: 'right' }
    },
    {
      label: 'Japan',
      officialName: 'Japan',
      capital: ['Tokyo'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 125960000,
      area: 377930,
      timezones: ['UTC+09:00'],
      borders: [],
      languages: { jpn: 'Japanese' },
      currency: { JPY: { name: 'Japanese yen', symbol: '¥' } },
      flag: 'https://flagcdn.com/jp.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/jp.svg',
      maps: { googleMaps: 'https://goo.gl/maps/NGTLSCSrA8bMrvnX9' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2013': 32.1 },
      car: { signs: ['J'], side: 'left' }
    },
    {
      label: 'United States',
      officialName: 'United States of America',
      capital: ['Washington, D.C.'],
      region: 'Americas',
      subregion: 'Northern America',
      population: 331002651,
      area: 9833517,
      continent: ['North America'],
      timezones: [
        'UTC−12:00',
        'UTC−11:00',
        'UTC−10:00',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−07:00',
        'UTC−06:00',
        'UTC−05:00',
        'UTC+10:00',
        'UTC+12:00'
      ],
      borders: ['CAN', 'MEX'],
      languages: { eng: 'English' },
      currency: { USD: { name: 'United States dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/us.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/us.svg',
      maps: { googleMaps: 'https://goo.gl/maps/5T6E5sQnZf9A9T2J6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'USA',
      latlng: [38.0, -97.0],
      postalCodeFormat: '#####-####'
    },
    {
      label: 'Germany',
      officialName: 'Federal Republic of Germany',
      capital: ['Berlin'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 83783942,
      area: 357114,
      continent: ['Europe'],
      timezones: ['UTC+01:00'],
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      languages: { deu: 'German' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/de.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/de.svg',
      maps: { googleMaps: 'https://goo.gl/maps/mD9FBMq1nvXUBrkv6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'GER',
      latlng: [51.0, 9.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'France',
      officialName: 'French Republic',
      capital: ['Paris'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 65273511,
      area: 551695,
      continent: ['Europe'],
      timezones: [
        'UTC−10:00',
        'UTC−09:30',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−04:00',
        'UTC−03:00',
        'UTC+01:00',
        'UTC+03:00',
        'UTC+04:00',
        'UTC+05:00',
        'UTC+11:00',
        'UTC+12:00'
      ],
      borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
      languages: { fra: 'French' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/fr.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/fr.svg',
      maps: { googleMaps: 'https://goo.gl/maps/g7QxxSFsWyTPKuzd7' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'FRA',
      latlng: [46.0, 2.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'Brazil',
      officialName: 'Federative Republic of Brazil',
      capital: ['Brasília'],
      region: 'Americas',
      subregion: 'South America',
      population: 212559417,
      area: 8515767,
      continent: ['South America'],
      timezones: ['UTC−05:00', 'UTC−04:00', 'UTC−03:00', 'UTC−02:00'],
      borders: ['ARG', 'BOL', 'COL', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
      languages: { por: 'Portuguese' },
      currency: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Australia',
      officialName: 'Commonwealth of Australia',
      capital: ['Canberra'],
      region: 'Oceania',
      subregion: 'Australia and New Zealand',
      population: 25499884,
      area: 7692024,
      continent: ['Oceania'],
      timezones: [
        'UTC+05:00',
        'UTC+06:30',
        'UTC+07:00',
        'UTC+08:00',
        'UTC+09:30',
        'UTC+10:00',
        'UTC+10:30',
        'UTC+11:30'
      ],
      borders: [],
      languages: { eng: 'English' },
      currency: { AUD: { name: 'Australian dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Russia',
      officialName: 'Russian Federation',
      capital: ['Moscow'],
      region: 'Europe',
      subregion: 'Eastern Europe',
      population: 144104080,
      area: 17098242,
      continent: ['Europe', 'Asia'],
      timezones: ['UTC+03:00 to UTC+12:00'],
      borders: [
        'AZE',
        'BLR',
        'CHN',
        'EST',
        'FIN',
        'GEO',
        'KAZ',
        'PRK',
        'LVA',
        'LTU',
        'MNG',
        'NOR',
        'POL',
        'UKR'
      ],
      languages: { rus: 'Russian' },
      currency: { RUB: { name: 'Russian ruble', symbol: '₽' } },
      flag: 'https://flagcdn.com/ru.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/ru.svg',
      maps: { googleMaps: 'https://goo.gl/maps/6ua6CX1mV2z5eYxZ6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'RUS',
      latlng: [60, 100],
      postalCodeFormat: '######'
    }
  ];

  useEffect(() => {
    setLocations(locationJSON);
  }, []);

  const prepareTravelPrompt = () => {
    if (!fromLocation || !toLocation || !checkIn || !checkOut) {
      notification('error', 'Please select all fields');
      return '';
    }

    return `Travel Destination Details:FROM LOCATION: ${fromLocation.label},TO LOCATION: ${toLocation.label},CHECK-IN DATE: ${checkIn},CHECK-OUT DATE: ${checkOut}`;
  };

 
 const handleSubmitPrompt = async () => {
  const travelPrompt = prepareTravelPrompt();

  if (!travelPrompt) {
    notification('error', 'Failed to prepare prompt');
    return;
  }

  if (disableButton) return;

  // Create a new chat entry with the travel details
  const newEntry: ChatEntry = {
    sessionId: currentSession || '',
    input: travelPrompt,
    output: null,
    isLoading: true,
    fileUrls: [], // No files for travel prompt
    topic: 'travel'
  };

  setChatHistory((prev) => [...prev, newEntry]);
  setDisableButton(true);
  try {
    const endpoint = `initiative/${selectedInitiative?.id}`;
    const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    const commonHeaders = {
      'accept': 'application/json , text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'origin': 'https://localhost:5173',
      'pragma': 'no-cache',
      "content-type": "application/json",
      'referer': 'https://gen-ai-foundation-demo-cec4ghc4aeesbjba.a03.azurefd.net',
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'x-api-key': '159c603a-2d22-4a5d-8b01-8158a5f6973c'
    };

    const payload: ChatRequest = {
      input_message: travelPrompt,
      ...(currentSession && { session_id: currentSession })
    };
    const response = await fetch(`${apiBaseUrl}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Travel response:', responseData.output_text);

    // Remove the loading state and update with response
    setChatHistory((prev) =>
      prev.map((entry, idx) =>
        idx === prev.length - 1
          ? { 
              ...entry, 
              sessionId: responseData?.session_id, 
              output: responseData?.output_text, 
              isLoading: false 
            }
          : entry
      )
    );

    setCurrentSession(responseData?.session_id);
    notification('success', 'Travel details fetched successfully!');
    
    if (setShowTravelChat) {
      setShowTravelChat(true);
    }

  } catch (error) {
    console.error('Error fetching travel details:', error);
    setChatHistory((prev) =>
      prev.map((entry, idx) =>
        idx === prev.length - 1
          ? { 
              ...entry, 
              output: ['Error occurred while fetching travel details'], 
              isLoading: false, 
              statusCode: 500 
            }
          : entry
      )
    );
    notification('error', 'Failed to fetch travel details. Please try again!');
  }
};
  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className='text-bold'>TRAVEL TO EXPLORE</h1>
          <p className='text-bold'>Find destinations at city, state, or country levels.</p>
        </div>
        <div className="row searchBox mt-5">
          <div className="col-md-3">
            <label>From</label>
            <Select
              options={locations}
              value={fromLocation}
              onChange={setFromLocation}
              placeholder="Search for Country..."
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '250px'
                }),
                control: (provided) => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none'
                })
              }}
            />
          </div>
          <div className="col-md-3">
            <label>To</label>
            <Select
              options={locations}
              value={toLocation}
              onChange={setToLocation}
              placeholder="Search for destination..."
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '250px'
                }),
                control: (provided) => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none'
                })
              }}
            />
            
          </div>
          <div className="col-md-3">
            <label>Check-in</label>
            <input
              type="date"
              className="bg-white  rounded-2"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="col-md-3">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              className="bg-white rounded-2"
              onChange={(e) => setCheckOut(e.target.value)}
              min={
                checkIn
                  ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
            />
          </div>
        </div>
        <div className='d-flex justify-content-center mt-5'>
        
              <button
                type="button"
                onClick={handleSubmitPrompt}
                disabled={!fromLocation || !toLocation || !checkIn || !checkOut}
                className="btn btn-primary p-3 text-center rounded-3"
                style={{
                  opacity: (!fromLocation || !toLocation || !checkIn || !checkOut) ? 0.5 : 1,
                  cursor: (!fromLocation || !toLocation || !checkIn || !checkOut) ? 'not-allowed' : 'pointer'
                }}
              >
                Explore Now
              </button>
        </div>
      </div>
    </div>
  );
};

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
};
