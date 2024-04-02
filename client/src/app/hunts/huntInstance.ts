export interface HuntInstance {
  _id: string;
  huntId: string;
  description: string;
  name: string;
  creationTime: Date;
  est: number;
  numberOfTasks: number;
}
