export interface IMessage {
  username: string;
  text: string;
  type: string;
  timestamp: Date;
  photoURL: string;
  userId: string;
}
export interface IUser {
  username: string;
  photoURL: string;
  id: string;
}

export interface IChat {
  chatName: string;
  roomId: string;
  photoURL: string;
}

export interface IConnectionStates {
  isPending: boolean;
  reconnection: boolean;
}
