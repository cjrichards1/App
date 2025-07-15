import React from 'react'
import ReactDOM from 'react-dom/client'
import { FlashcardForm as App } from './App.tsx'
import { useFlashcards } from './hooks/useFlashcards'
import './index.css'

function AppWrapper() {
  const { folders, categories, addFlashcard } = useFlashcards();
  
  return (
    <App 
      folders={folders}
      categories={categories}
      onAdd={addFlashcard}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)