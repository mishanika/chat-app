export interface IMessage {
  username: string;
  text: string;
  type: string;
  timestamp: Date;
}
export interface IUser {
  username: string;
  photoURL: string;
}

export interface IChat {
  chatId: string;
  username: string;
  photoURL: string;
  lastMsg: string;
  messages: IMessage[];
}
