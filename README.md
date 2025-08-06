# Live API - Web Console

This repository contains a react-based starter app for using the [Live API](<[https://ai.google.dev/gemini-api](https://ai.google.dev/api/multimodal-live)>) over a websocket. It provides modules for streaming audio playback, recording user media such as from a microphone, webcam or screen capture as well as a unified log view to aid in development of your application.

[![Live API Demo](readme/thumbnail.png)](https://www.youtube.com/watch?v=J_q7JY1XxFE)

Watch the demo of the Live API [here](https://www.youtube.com/watch?v=J_q7JY1XxFE).

## Usage

To get started, [create a free Gemini API key](https://aistudio.google.com/apikey) and add it to the `.env` file. Then:

```
$ npm install && npm start
```

We have provided several example applications on other branches of this repository:

- [demos/GenExplainer](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genexplainer)
- [demos/GenWeather](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genweather)
- [demos/GenList](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genlist)

## Adding Custom Functionality

The demo branches above follow a consistent pattern for adding domain-specific functionality to the Live API console. Here's the recommended approach:

### 1. Create a Custom Main Component

Create a dedicated component that replaces the default content in the main app area:

```typescript
// src/components/your-feature/YourFeature.tsx
export function YourFeature() {
  const { client, setConfig, connected, connect } = useLiveAPIContext();
  // Your component logic here
  return <div>Your custom UI</div>;
}
```

### 2. Configure System Instructions

Define the AI's behavior and role through system instructions:

```typescript
useEffect(() => {
  setConfig({
    model: "models/gemini-2.0-flash-exp",
    systemInstruction: {
      parts: [{
        text: `You are a specialized assistant for [your domain].
        - Define the AI's role and personality
        - Specify response format and style
        - Include domain-specific guidelines
        - Set expectations for tool usage`
      }]
    },
    // Add tools, generation config, etc.
  });
}, [setConfig]);
```

### 3. Add Tools (Optional)

For complex functionality, define function declarations:

```typescript
const tools: Tool[] = [{
  functionDeclarations: [{
    name: "your_function_name",
    description: "What this function does",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        // Define parameters here
      },
      required: ["param1"]
    }
  }]
}];
```

### 4. Implement Auto-Connection Pattern

Most demos auto-connect when user input is ready:

```typescript
const handleStart = async () => {
  if (userInputReady && !connected) {
    await connect();
    client.send([{ text: "Initial prompt based on user selections" }]);
  }
};
```

### 5. Replace Main App Content

Update `App.tsx` to show your component:

```typescript
// In App.tsx main app area
<div className="main-app-area">
  {!connected ? (
    <YourPreSessionComponent />
  ) : (
    <>
      <YourFeature />
      <video /* existing video element */ />
    </>
  )}
</div>
```

### Best Practices

1. **Single Responsibility**: Focus each implementation on one primary use case
2. **Guided UX**: Provide clear UI that guides users through necessary setup/selections  
3. **System Instructions First**: Always configure system instructions before connecting
4. **State Management**: Use React state to manage user inputs and application flow
5. **Error Handling**: Handle connection failures and validation gracefully
6. **Tool Integration**: Use tools for complex, multi-step functionality
7. **External APIs**: Integrate external services when your use case requires it

### Examples from Demo Branches

- **GenWeather**: Weather reports with character personalities, integrates OpenWeatherMap + Google Maps
- **GenList**: Interactive checklist management with CRUD operations via tools
- **GenExplainer**: Educational explanations with different teaching styles

This pattern allows you to create focused, domain-specific applications that leverage the Live API's conversational and multimodal capabilities while providing users with a tailored experience.

## Example

Below is an example of an entire application that will use Google Search grounding and then render graphs using [vega-embed](https://github.com/vega/vega-embed):

```typescript
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

export const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

export function Altair() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      systemInstruction: {
        parts: [
          {
            text: 'You are my helpful assistant. Any time I ask you for a graph call the "render_altair" function I have provided you. Dont ask for additional information just make your best judgement.',
          },
        ],
      },
      tools: [{ googleSearch: {} }, { functionDeclarations: [declaration] }],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const str = (fc.args as any).json_graph;
        setJSONString(str);
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}
```

## development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Project consists of:

- an Event-emitting websocket-client to ease communication between the websocket and the front-end
- communication layer for processing audio in and out
- a boilerplate view for starting to build your apps and view logs

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

_This is an experiment showcasing the Live API, not an official Google product. We’ll do our best to support and maintain this experiment but your mileage may vary. We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators' rights, including copyright and trademark rights when present, when sharing these works and creating derivative work. If you want more info on Google's policy, you can find that [here](https://developers.google.com/terms/site-policies)._
