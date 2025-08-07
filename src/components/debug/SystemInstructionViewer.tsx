import React, { useState } from 'react';
import { useDrill } from '../../contexts/DrillContext';
import { generateGreetingMessage } from '../../lib/system-instructions';

const SystemInstructionViewer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const { systemInstruction, currentDrill } = useDrill();
  
  const greetingMessage = generateGreetingMessage(currentDrill);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '5px 10px',
          fontSize: '12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        View System Instruction
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      width: '400px',
      maxHeight: '500px',
      zIndex: 1000,
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '15px',
      fontSize: '12px',
      overflow: 'auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>Debug: {currentDrill.title}</h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={() => setShowGreeting(!showGreeting)}
          style={{
            background: showGreeting ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '11px',
            marginRight: '10px'
          }}
        >
          {showGreeting ? 'Hide Greeting' : 'Show Greeting Message'}
        </button>
      </div>
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: showGreeting ? '#666' : '#333' }}>
          {showGreeting ? 'Greeting Message:' : 'System Instruction:'}
        </h4>
        <pre style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          margin: 0,
          fontSize: '11px',
          lineHeight: '1.4'
        }}>
          {showGreeting ? greetingMessage : systemInstruction}
        </pre>
      </div>
    </div>
  );
};

export default SystemInstructionViewer;