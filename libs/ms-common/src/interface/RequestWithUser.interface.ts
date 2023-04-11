import { Request } from 'express';

interface User {
  id: number;
  email: string | '';
  apiKey: string | '';
}

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;
