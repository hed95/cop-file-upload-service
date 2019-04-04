interface ILogMessage {
  filename: string;
  email: string;
  level?: string;
  message: string;
  timestamp?: string;
}

export default ILogMessage;
