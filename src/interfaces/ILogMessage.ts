interface ILogMessage {
  filename: string;
  level?: string;
  message: string;
  timestamp?: string;
}

export default ILogMessage;
