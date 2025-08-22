# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based starter application for using Google's Gemini Live API over websockets. It provides a web console for real-time multimodal AI interactions with audio streaming, video capture (webcam/screen), and visualization capabilities.

## Commands

### Development Commands
- `npm start` - Start development server on http://localhost:3000
- `npm run start-https` - Start with HTTPS enabled (required for media permissions)
- `npm run build` - Build for production
- `npm test` - Run tests

### Environment Setup
- Create a `.env` file with `REACT_APP_GEMINI_API_KEY=your_api_key_here`
- Get API key from https://aistudio.google.com/apikey

## Architecture Overview

### Core Client Architecture
The application is built around an event-driven WebSocket client (`GenAILiveClient`) that manages bidirectional communication with Google's Gemini Live API:

- **GenAILiveClient** (`src/lib/genai-live-client.ts`) - Event-emitting WebSocket client that handles all Live API communication
- **LiveAPIContext** (`src/contexts/LiveAPIContext.tsx`) - React context providing client instance and connection state
- **useLiveAPI hook** (`src/hooks/use-live-api.ts`) - Primary hook for managing API connection, audio streaming, and state

### Audio Processing Pipeline
Real-time audio is handled through a sophisticated streaming system:

- **AudioStreamer** (`src/lib/audio-streamer.ts`) - Manages audio playback queue, PCM16 conversion, and Web Audio API integration
- **Audio Worklets** (`src/lib/worklets/`) - Volume meters and audio processing using AudioWorkletNode
- **Media Stream Hooks** - `use-media-stream-mux.ts`, `use-webcam.ts`, `use-screen-capture.ts` for input capture

### Component Architecture
- **App.tsx** - Root component with LiveAPIProvider and main layout
- **ControlTray** - Media controls (mic, camera, screen sharing)  
- **SidePanel** - Settings, logs, and configuration UI
- **Logger** - Real-time event logging with expandable message details
- **Altair** - Vega-Lite chart rendering component for data visualization
- **Settings Dialog** - Voice selection and response modality configuration

### Key Data Flow
1. Media input (audio/video) → captured via hooks → sent as base64 chunks to API
2. API responses → received by GenAILiveClient → emitted as events
3. Audio responses → processed by AudioStreamer → played through Web Audio API
4. Tool calls → handled by components → responses sent back to API
5. All events logged → displayed in Logger component

### Integration Patterns

#### Adding New Functionality
Components should use the `useLiveAPIContext()` hook to access:
- `client` - GenAILiveClient instance for event handling
- `setConfig` - Configure model settings, tools, system instructions
- `connected` - Connection state
- `connect/disconnect` - Connection management

#### Tool Integration
Register function declarations in `setConfig({ tools: [{ functionDeclarations: [declaration] }] })` and listen for `toolcall` events on the client.

#### Model Configuration
The default model is "models/gemini-2.0-flash-exp". Configure via `setModel()` and `setConfig()` with system instructions, tools, and other LiveConnectConfig options.

## Key Dependencies

- **@google/genai** - Official Google Gemini API client
- **react**, **react-dom** - UI framework  
- **zustand** - State management
- **vega-embed**, **vega-lite** - Data visualization
- **sass** - Styling
- **eventemitter3** - Event handling
- **lodash** - Utilities

## Development Notes

- The app requires HTTPS for media permissions in production
- Audio processing uses 24kHz sample rate with PCM16 format
- All API communication is logged in real-time via the Logger component
- Media streams are managed through specialized React hooks
- Component styling uses SASS with modular component-specific stylesheets