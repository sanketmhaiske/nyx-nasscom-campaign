"use client"
import { createContext, useState } from "react";

const MessagePopupContext = createContext();

const MessagePopupContextProvider = (props) => {
  const [messageType, setMessageType] = useState('error');
  const [messageTitle, setMessageTitle] = useState('Error');
  const [messageKey, setMessageKey] = useState('');
  const [messageContent, setMessageContent] = useState('Error');
  const [onCloseCallback, setOnCloseCallback] = useState(null); 
  const [isOpenFlag, setIsOpenFlag] = useState(false);
  
  const handleRequsetClose = () => {
    setIsOpenFlag(false);
    
    if (onCloseCallback) {
      onCloseCallback(messageKey);
    }
  }

  const displayMessagePopup = (key, type, title, message, callback = null) => {
    setIsOpenFlag(true);
    setMessageType(type);
    setMessageTitle(title);
    setMessageContent(message);
    setOnCloseCallback(callback);
    setMessageKey(key);
  }

  const providerValues = {
    messageType, setMessageType,
    isOpenFlag, setIsOpenFlag,
    messageKey, setMessageKey,
    messageContent, setMessageContent,
    onCloseCallback, setOnCloseCallback,
    messageTitle, setMessageTitle,
    displayMessagePopup,
    handleRequsetClose,
  };

  return <MessagePopupContext.Provider value={providerValues}>
    {props.children}
  </MessagePopupContext.Provider>
}

export {MessagePopupContext, MessagePopupContextProvider};