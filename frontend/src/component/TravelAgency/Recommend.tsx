import { useState } from 'react';
import styled from 'styled-components';
import Destination1 from '../TravelAgency/assets/Destination1.png';
import Destination2 from '../TravelAgency/assets/Destination2.png';
import Destination3 from '../TravelAgency/assets/Destination3.png';
import Destination4 from '../TravelAgency/assets/Destination4.png';
import Destination5 from '../TravelAgency/assets/Destination5.png';
import Destination6 from '../TravelAgency/assets/Destination6.png';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface RecommendProps {
  data: string; // Replace 'string' with the appropriate type if needed
}

interface HeadingProps {
  node?: HastNode;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function Recommend({ data }: RecommendProps) {
  const data1 = [
    {
      image: Destination1,
      title: 'Singapore',
      subTitle: 'Singapore, officialy thr Republic of Singapore, is a',
      cost: '38,800',
      duration: 'Approx 2 night trip'
    },
    {
      image: Destination2,
      title: 'Thailand',
      subTitle: "Thailand is a Southeast Asia country. It's known for",
      cost: '54,200',
      duration: 'Approx 2 night trip'
    },
    {
      image: Destination3,
      title: 'Paris',
      subTitle: "Paris, France's capital, is a major European city and a",
      cost: '45,500',
      duration: 'Approx 2 night trip'
    },
    {
      image: Destination4,
      title: 'New Zealand',
      subTitle: 'New Zealand is an island country in the',
      cost: '24,100',
      duration: 'Approx 1 night trip'
    },
    {
      image: Destination5,
      title: 'Bora Bora',
      subTitle: 'Bora Bora is a small South Pacific island northwest of',
      cost: '95,400',
      duration: 'Approx 2 night 2 day trip'
    },
    {
      image: Destination6,
      title: 'London',
      subTitle: 'London, the capital of England and the United',
      cost: '38,800',
      duration: 'Approx 3 night 2 day trip'
    }
  ];

  console.log('ad', data);

  const packages = [
    'The Weekend Break',
    'The Package Holiday',
    'The Group Tour',
    'Long Term Slow Travel'
  ];

  const [active, setActive] = useState(1);
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

  return (
    <Section id="recommend">
      <div className="title">
        <h2>Recommended Details</h2>
      </div>
      <div className="packages">
        {/* <ul>
          {packages.map((pkg, index) => {
            return (
              <li
                className={active === index + 1 ? 'active' : ''}
                onClick={() => setActive(index + 1)}>
                {pkg}
              </li>
            );
          })}
        </ul> */}
      </div>
      <div className="destinations">
        <div className="destination">
          <Markdown
            // key={index}
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
            {data ? data[0] : ''}
          </Markdown>
        </div>
        {/* {data.map((destination) => {
          return (
            <div className="destination">
              <img src={destination.image} alt="" />
              <h3>{destination.title}</h3>
              <p>{destination.subTitle}</p>
              <div className="info">
                <div className="services">
                  <img src={info1} alt="" />
                  <img src={info2} alt="" />
                  <img src={info3} alt="" />
                </div>
                <h4>{destination.cost}</h4>
              </div>
              <div className="distance">
                <span>1000 Kms</span>
                <span>{destination.duration}</span>
              </div>
            </div>
          );
        })} */}
      </div>
    </Section>
  );
}

const Section = styled.section`
  padding: 2rem 0;
  .title {
    text-align: center;
  }
  .packages {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    ul {
      display: flex;
      list-style-type: none;
      width: max-content;
      li {
        padding: 1rem 2rem;
        border-bottom: 0.1rem solid black;
      }
      .active {
        border-bottom: 0.5rem solid #8338ec;
      }
    }
  }
  .destinations {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 3rem;
    padding: 0 3rem;
    .destination {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background-color: #8338ec14;
      border-radius: 1rem;
      transition: 0.3s ease-in-out;
      &:hover {
        transform: translateX(0.4rem) translateY(-1rem);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
      img {
        width: 100%;
      }
      .info {
        display: flex;
        align-items: center;
        .services {
          display: flex;
          gap: 0.3rem;
          img {
            border-radius: 1rem;
            background-color: #4d2ddb84;
            width: 2rem;
            /* padding: 1rem; */
            padding: 0.3rem 0.4rem;
          }
        }
        display: flex;
        justify-content: space-between;
      }
      .distance {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  @media screen and (min-width: 280px) and (max-width: 768px) {
    .packages {
      ul {
        li {
          padding: 0 0.5rem;
          font-size: 2vh;
          padding-bottom: 1rem;
        }
        .active {
          border-bottom-width: 0.3rem;
        }
      }
    }
    .destinations {
      grid-template-columns: 1fr;
      padding: 0;
    }
  }
`;
