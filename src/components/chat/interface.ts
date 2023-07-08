export interface IMessage {
  username: string;
  text: string;
  type: string;
  timestamp: Date;
  photoURL: string;
}
export interface IUser {
  username: string;
  photoURL: string;
  id: string;
}

export interface IChat {
  chatId: string;
  username: string;
  photoURL: string;
  lastMsg: string;
  messages: IMessage[];
}
